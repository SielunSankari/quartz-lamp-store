import Stripe from 'stripe';
// Серверный экземпляр Stripe. Секретный ключ НИКОГДА не попадает в браузер —
// этот файл импортируется только в Route Handlers (app/api/...).
import 'server-only';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY не задан в .env.local');
}

export const stripe = new Stripe(secretKey);
