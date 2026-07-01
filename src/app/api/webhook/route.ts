import type Stripe from 'stripe';
import { adminDb } from '@/libs/firebaseAdmin';
import { getStripe } from '@/libs/stripe';
import { NextResponse } from 'next/server';

// POST /api/webhook
// Stripe вызывает этот адрес после оплаты. Здесь подтверждается, что платёж реальный
// (по подписи), и заказ помечается оплаченным, а корзина пользователя очищается.
//
// Локально нужен Stripe CLI:
//   stripe listen --forward-to localhost:3000/api/webhook
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature') ?? '';
  const body = await request.text(); // нужен СЫРОЙ текст тела для проверки подписи

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Invalid Stripe signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const uid = session.metadata?.uid;

    // Событие «completed» ещё не гарантирует оплату (у отложенных методов оплаты
    // сессия завершена, но payment_status = 'unpaid'). Помечаем оплаченным только
    // при реально прошедшем платеже.
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true });
    }

    if (orderId) {
      const orderRef = adminDb.collection('orders').doc(orderId);
      try {
        // Транзакция даёт идемпотентность (повторные вебхуки Stripe не навредят)
        // и сверку суммы: заказ помечается 'paid' только один раз и только если
        // Stripe списал ровно ту сумму, что мы рассчитали (KZT × 100 = тиыны).
        await adminDb.runTransaction(async (tx) => {
          const snap = await tx.get(orderRef);
          if (!snap.exists) {
            return;
          }

          const order = snap.data() as { status?: string; total?: number };
          if (order.status === 'paid') {
            return; // уже обработан — повторное событие игнорируем
          }

          const expected = Math.round(Number(order.total ?? 0) * 100);
          if (session.amount_total !== expected) {
            console.error(
              `Amount mismatch for order ${orderId}: paid ${session.amount_total}, expected ${expected}`,
            );
            return;
          }

          tx.update(orderRef, { status: 'paid', paidAt: Date.now() });
        });
      } catch (err) {
        console.error('Failed to mark order paid:', err);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
      }
    }

    // Очищаем корзину пользователя после успешной оплаты.
    if (uid) {
      await adminDb.collection('carts').doc(uid).set({ items: [] }, { merge: true });
    }
  }

  return NextResponse.json({ received: true });
}
