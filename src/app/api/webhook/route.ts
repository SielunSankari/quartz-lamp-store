import type Stripe from 'stripe';
import { adminDb } from '@/libs/firebaseAdmin';
import { stripe } from '@/libs/stripe';
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
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Invalid Stripe signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const uid = session.metadata?.uid;

    if (orderId) {
      await adminDb.collection('orders').doc(orderId).update({ status: 'paid' });
    }
    // Очищаем корзину пользователя после успешной оплаты.
    if (uid) {
      await adminDb.collection('carts').doc(uid).set({ items: [] }, { merge: true });
    }
  }

  return NextResponse.json({ received: true });
}
