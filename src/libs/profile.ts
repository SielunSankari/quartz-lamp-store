// Профиль пользователя в Firestore — users/{uid}. Пока хранит только город,
// но сюда же можно будет добавить телефон, имя и т.п.
import { db } from '@/libs/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const profileRef = (uid: string) => doc(db, 'users', uid);

export async function getUserCity(uid: string): Promise<string | null> {
  const snap = await getDoc(profileRef(uid));
  return (snap.data()?.city as string | undefined) ?? null;
}

export async function setUserCity(uid: string, city: string) {
  await setDoc(profileRef(uid), { city }, { merge: true });
}
