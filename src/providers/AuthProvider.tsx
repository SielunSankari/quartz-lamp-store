'use client';

// Единый источник правды о пользователе.
// Firebase сам хранит сессию (в IndexedDB браузера) и через onAuthStateChanged
// сообщает, кто вошёл. Поэтому свой useUserStore + localStorage больше не нужны.
import type { User } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import {
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { createContext, use, useEffect, useMemo, useState } from 'react';

type AuthContextValue = {
  user: User | null;
  loading: boolean; // true, пока Firebase проверяет, есть ли активная сессия
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Подписка на изменения авторизации. Срабатывает при загрузке, входе и выходе.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signInWithGoogle: async () => {
      await signInWithPopup(auth, new GoogleAuthProvider());
    },
    // Apple-вход заработает только после настройки Apple Developer + включения
    // провайдера Apple в Firebase Console. До этого кнопка вернёт ошибку Firebase.
    signInWithApple: async () => {
      await signInWithPopup(auth, new OAuthProvider('apple.com'));
    },
    logout: async () => {
      await signOut(auth);
    },
  }), [user, loading]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

// Хук, которым пользуются компоненты: const { user, signInWithGoogle } = useAuth()
export function useAuth() {
  const ctx = use(AuthContext);
  if (!ctx) {
    throw new Error('useAuth должен вызываться внутри <AuthProvider>');
  }
  return ctx;
}
