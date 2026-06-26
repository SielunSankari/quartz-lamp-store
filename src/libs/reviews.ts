// Отзывы в Firestore. Документ на пользователя — reviews/{uid}, поэтому один
// аккаунт может оставить только ОДИН отзыв (повторный setDoc редактирует его).
import { db } from '@/libs/firebase';
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';

export type Review = {
  userId: string;
  userName: string;
  userAvatarColor: string;
  rating: number;
  text: string;
  city: string;
  createdAt: number; // Unix-время в мс
};

export type ReviewInput = {
  userName: string;
  userAvatarColor: string;
  rating: number;
  text: string;
  city: string;
};

const reviewRef = (uid: string) => doc(db, 'reviews', uid);

// Подписка на отзывы: новые сверху (createdAt DESC), с лимитом.
export function subscribeReviews(cb: (reviews: Review[]) => void, max = 30) {
  const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(max));
  return onSnapshot(
    q,
    snap => cb(snap.docs.map(d => d.data() as Review)),
    () => cb([]), // нет доступа / правила не опубликованы — пусто, без падения
  );
}

export async function getMyReview(uid: string): Promise<Review | null> {
  const snap = await getDoc(reviewRef(uid));
  return snap.exists() ? (snap.data() as Review) : null;
}

// Создать или отредактировать свой отзыв. createdAt при правке сохраняется.
export async function upsertReview(uid: string, input: ReviewInput) {
  const existing = await getDoc(reviewRef(uid));
  const createdAt = existing.exists()
    ? ((existing.data().createdAt as number | undefined) ?? Date.now())
    : Date.now();

  await setDoc(reviewRef(uid), {
    userId: uid,
    userName: input.userName,
    userAvatarColor: input.userAvatarColor,
    rating: Math.max(1, Math.min(5, Math.round(input.rating))),
    text: input.text.trim().slice(0, 600),
    city: input.city.trim().slice(0, 60),
    createdAt,
    updatedAt: Date.now(),
  });
}
