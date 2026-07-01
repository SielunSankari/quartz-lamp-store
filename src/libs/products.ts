// Чтение товаров из Firestore. Вызывается в серверных компонентах
// (products/page.tsx и products/[id]/page.tsx) — клиентский SDK тут работает,
// т.к. чтение товаров публичное (это разрешат Security Rules).
import type { Product } from '@/types/shop';
import { db } from '@/libs/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { cache } from 'react';

// Превращаем «сырой» документ Firestore в типизированный Product с защитой от мусора.
function toProduct(id: string, data: Record<string, unknown>): Product {
  const images = Array.isArray(data.images) ? data.images.map(String) : undefined;
  const specs = Array.isArray(data.specs)
    ? data.specs.map((s: Record<string, unknown>) => ({
        label: String(s?.label ?? ''),
        value: String(s?.value ?? ''),
      }))
    : undefined;
  const d = data.details as Record<string, unknown> | undefined;
  const details = d
    ? {
        summary: String(d.summary ?? ''),
        advantages: Array.isArray(d.advantages) ? d.advantages.map(String) : [],
        usage: Array.isArray(d.usage) ? d.usage.map(String) : [],
        safety: Array.isArray(d.safety) ? d.safety.map(String) : [],
      }
    : undefined;

  return {
    id,
    name: String(data.name ?? ''),
    description: String(data.description ?? ''),
    price: Number(data.price ?? 0),
    imageUrl: String(data.imageUrl ?? ''),
    ...(images ? { images } : {}),
    ...(data.alt ? { alt: String(data.alt) } : {}),
    ...(data.kaspiUrl ? { kaspiUrl: String(data.kaspiUrl) } : {}),
    ...(data.halykUrl ? { halykUrl: String(data.halykUrl) } : {}),
    ...(specs ? { specs } : {}),
    ...(details ? { details } : {}),
  };
}

// cache() дедуплицирует чтение в пределах одного рендера запроса — например,
// generateMetadata и сам компонент страницы товара вызывают getProduct с тем же
// id, но к Firestore уходит лишь один запрос. Кэширование между запросами
// обеспечивает ISR (`export const revalidate` на страницах).
export const getProducts = cache(async (): Promise<Product[]> => {
  const q = query(collection(db, 'products'), orderBy('price'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(d => toProduct(d.id, d.data()))
    .filter(p => p.name && p.price > 0);
});

export const getProduct = cache(async (id: string): Promise<Product | null> => {
  const ref = doc(db, 'products', id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return null;
  }
  return toProduct(snapshot.id, snapshot.data());
});
