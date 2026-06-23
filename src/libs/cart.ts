// Операции с корзиной в Firestore. Корзина каждого пользователя — это ОДИН документ
// carts/{uid} с полем items (массив товаров). Для магазина на ~6 товаров этого
// более чем достаточно и проще всего (читаем/пишем корзину целиком, атомарно).
import type { CartItem, Product } from '@/types/shop';
import { db } from '@/libs/firebase';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';

function cartRef(uid: string) {
  return doc(db, 'carts', uid);
}

function readItems(data: Record<string, unknown> | undefined): CartItem[] {
  const items = (data?.items as CartItem[] | undefined) ?? [];
  return Array.isArray(items) ? items : [];
}

export async function getCart(uid: string): Promise<CartItem[]> {
  const snap = await getDoc(cartRef(uid));
  return readItems(snap.data());
}

// Подписка на изменения корзины в реальном времени (для шапки/профиля).
// Возвращает функцию отписки.
export function subscribeCart(uid: string, cb: (items: CartItem[]) => void) {
  return onSnapshot(cartRef(uid), snap => cb(readItems(snap.data())));
}

export async function addToCart(uid: string, product: Product, quantity = 1) {
  const items = await getCart(uid);
  const existing = items.find(i => i.id === product.id);

  const next = existing
    ? items.map(i => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i))
    : [...items, { ...product, quantity }];

  await setDoc(cartRef(uid), { items: next }, { merge: true });
}

export async function removeFromCart(uid: string, productId: string) {
  const items = await getCart(uid);
  const next = items.filter(i => i.id !== productId);
  await setDoc(cartRef(uid), { items: next }, { merge: true });
}

export async function clearCart(uid: string) {
  await setDoc(cartRef(uid), { items: [] }, { merge: true });
}
