'use client';

import { DEFAULT_CITY } from '@/libs/cities';
import { getUserCity, setUserCity } from '@/libs/profile';
import { useAuth } from '@/providers/AuthProvider';
import { createContext, use, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'baimed-city';

type CityContextValue = {
  city: string;
  setCity: (c: string) => void;
};

const CityContext = createContext<CityContextValue | null>(null);

// Город пользователя: для гостей — localStorage, для вошедших — привязан к
// аккаунту (Firestore users/{uid}). При входе подтягивается город аккаунта.
export function CityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [city, setCityState] = useState(DEFAULT_CITY);

  // Начальное значение из localStorage.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCityState(saved);
    }
  }, []);

  // При входе — подтянуть город из аккаунта (если сохранён).
  useEffect(() => {
    if (!user) {
      return;
    }
    getUserCity(user.uid).then((c) => {
      if (c) {
        setCityState(c);
        localStorage.setItem(STORAGE_KEY, c);
      }
    });
  }, [user]);

  const value = useMemo<CityContextValue>(() => ({
    city,
    setCity: (c) => {
      setCityState(c);
      localStorage.setItem(STORAGE_KEY, c);
      if (user) {
        setUserCity(user.uid, c).catch(() => {});
      }
    },
  }), [city, user]);

  return <CityContext value={value}>{children}</CityContext>;
}

export function useCity() {
  const ctx = use(CityContext);
  if (!ctx) {
    throw new Error('useCity должен вызываться внутри <CityProvider>');
  }
  return ctx;
}
