'use client';

// Единый источник правды о пользователе.
// Firebase сам хранит сессию и через onAuthStateChanged сообщает, кто вошёл.
import type { ConfirmationResult, User } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  RecaptchaVerifier,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { createContext, use, useEffect, useMemo, useState } from 'react';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  startPhoneSignIn: (phone: string, containerId: string) => Promise<ConfirmationResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Один невидимый reCAPTCHA на сессию (для телефонной авторизации).
let recaptcha: RecaptchaVerifier | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    signInWithApple: async () => {
      await signInWithPopup(auth, new OAuthProvider('apple.com'));
    },
    // Регистрация по email/паролю + письмо для подтверждения почты.
    signUpWithEmail: async (email, password) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
    },
    signInWithEmail: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    resetPassword: async (email) => {
      await sendPasswordResetEmail(auth, email);
    },
    // Телефон: невидимый reCAPTCHA → SMS с кодом. Возвращаем ConfirmationResult,
    // у которого вызывают .confirm(code) для входа.
    startPhoneSignIn: async (phone, containerId) => {
      // Пересоздаём verifier каждый раз — иначе после ошибки reCAPTCHA «залипает».
      recaptcha?.clear();
      recaptcha = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
      return signInWithPhoneNumber(auth, phone, recaptcha);
    },
    logout: async () => {
      await signOut(auth);
    },
  }), [user, loading]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = use(AuthContext);
  if (!ctx) {
    throw new Error('useAuth должен вызываться внутри <AuthProvider>');
  }
  return ctx;
}
