// Чтение товаров из Firestore. Вызывается в серверных компонентах
// (products/page.tsx и products/[id]/page.tsx) — клиентский SDK тут работает,
// т.к. чтение товаров публичное (это разрешат Security Rules).
import type { Product } from '@/types/shop';
import { db } from '@/libs/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';

// Превращаем «сырой» документ Firestore в типизированный Product с защитой от мусора.
function toProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: String(data.name ?? ''),
    description: String(data.description ?? ''),
    price: Number(data.price ?? 0),
    imageUrl: String(data.imageUrl ?? ''),
  };
}

export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, 'products'), orderBy('price'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(d => toProduct(d.id, d.data()))
    .filter(p => p.name && p.price > 0);
}

export async function getProduct(id: string): Promise<Product | null> {
  const ref = doc(db, 'products', id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return null;
  }
  return toProduct(snapshot.id, snapshot.data());
}
