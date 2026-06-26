// Заказы пользователя в Firestore. Правила разрешают читать только свои
// (where userId == auth.uid).
import type { Order } from '@/types/shop';
import { db } from '@/libs/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function getOrders(uid: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('userId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
}
