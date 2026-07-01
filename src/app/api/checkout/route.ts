import type { CartItem, Product } from '@/types/shop';
import arcjet from '@/libs/Arcjet';
import { adminAuth, adminDb } from '@/libs/firebaseAdmin';
import { getStripe } from '@/libs/stripe';
import { getBaseUrl } from '@/utils/Helpers';
import { fixedWindow } from '@arcjet/next';
import { NextResponse } from 'next/server';

// Rate limit: не больше 10 запросов checkout за минуту с одного IP.
// Middleware пропускает /api без проверки (иначе ломается вебхук Stripe),
// поэтому защиту навешиваем прямо на маршрут.
const aj = arcjet.withRule(
  fixedWindow({ mode: 'LIVE', window: '60s', max: 10 }),
);

// POST /api/checkout
// 1) проверяем, что запрос от вошедшего пользователя (Firebase ID token);
// 2) читаем его корзину (берём оттуда ТОЛЬКО id товара и количество);
// 3) ⚠️ БЕЗОПАСНОСТЬ: цены берём не из корзины (её пишет клиент и мог подделать),
//    а из коллекции products на сервере — это «источник правды» по деньгам;
// 4) создаём заказ pending и Stripe Checkout Session.
export async function POST(request: Request) {
  try {
    // --- Rate limiting / bot shield (если задан ARCJET_KEY) ---
    if (process.env.ARCJET_KEY) {
      const decision = await aj.protect(request);
      if (decision.isDenied()) {
        const status = decision.reason.isRateLimit() ? 429 : 403;
        return NextResponse.json({ error: 'Too many requests' }, { status });
      }
    }

    // --- Авторизация ---
    const authHeader = request.headers.get('Authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // --- Корзина: доверяем только id и quantity ---
    const cartSnap = await adminDb.collection('carts').doc(uid).get();
    const cartItems = (cartSnap.data()?.items as CartItem[] | undefined) ?? [];
    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // --- Перечитываем реальные товары из products одним пакетным запросом ---
    // (getAll вместо последовательных get в цикле — один round-trip вместо N).
    const uniqueIds = [...new Set(cartItems.map(i => i.id))];
    const productRefs = uniqueIds.map(id => adminDb.collection('products').doc(id));
    const productSnaps = await adminDb.getAll(...productRefs);
    const productById = new Map(
      productSnaps
        .filter(snap => snap.exists)
        .map(snap => [snap.id, snap.data() as Omit<Product, 'id'>]),
    );

    const verifiedItems: CartItem[] = [];
    for (const cartItem of cartItems) {
      const quantity = Math.max(1, Math.floor(Number(cartItem.quantity) || 0));
      const product = productById.get(cartItem.id);

      // Товар пропал из каталога — пропускаем его (не даём купить «фантом»).
      if (!product) {
        continue;
      }

      verifiedItems.push({
        id: cartItem.id,
        name: product.name, // имя и цена — из БД, а не из корзины
        description: product.description,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        quantity,
      });
    }

    if (verifiedItems.length === 0) {
      return NextResponse.json({ error: 'No valid items in cart' }, { status: 400 });
    }

    const total = verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // --- Заказ (pending) — сохраняем уже проверенные позиции и сумму ---
    const orderRef = await adminDb.collection('orders').add({
      userId: uid,
      items: verifiedItems,
      total,
      status: 'pending',
      createdAt: Date.now(),
    });

    // --- Stripe Checkout Session ---
    const appUrl = getBaseUrl();
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      // KZT не входит в zero-decimal валюты Stripe → сумма в тиынах (× 100).
      line_items: verifiedItems.map(item => ({
        quantity: item.quantity,
        price_data: {
          currency: 'kzt',
          unit_amount: Math.round(item.price * 100),
          product_data: { name: item.name },
        },
      })),
      success_url: `${appUrl}/personal/user-profile?paid=1`,
      cancel_url: `${appUrl}/personal/user-profile?canceled=1`,
      client_reference_id: orderRef.id,
      metadata: { orderId: orderRef.id, uid },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
