import Stripe from 'stripe';
// Серверный экземпляр Stripe. Секретный ключ НИКОГДА не попадает в браузер —
// этот файл импортируется только в Route Handlers (app/api/...).
// Ленивая инициализация: импорт файла не падает без ключа (иначе ломается
// прод-билд). Ошибка — только при реальном вызове checkout/webhook без ключа.
import 'server-only';

let instance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!instance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY не задан');
    }
    instance = new Stripe(secretKey);
  }
  return instance;
}
