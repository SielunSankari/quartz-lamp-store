'use client';

import type { ConfirmationResult } from 'firebase/auth';
import { useAuth } from '@/providers/AuthProvider';
import { motion } from 'framer-motion';
import { MailCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';

type Mode = 'signin' | 'signup';
type Method = 'email' | 'phone';
type View = 'form' | 'verify-email' | 'phone-code';

// Нормализуем телефон в формат E.164 (+7…) для Firebase.
function normalizePhone(input: string) {
  let d = input.replace(/\D/g, '');
  if (d.startsWith('8')) {
    d = `7${d.slice(1)}`;
  }
  if (d.length === 10) {
    d = `7${d}`;
  }
  return `+${d}`;
}

function mapError(e: unknown, t: (k: string) => string) {
  const code = (e as { code?: string })?.code ?? '';
  // Реальный код Firebase — в консоль, чтобы было видно причину при отладке.

  console.error('[auth]', code || e);
  switch (code) {
    case 'auth/operation-not-allowed':
      return t('errors.method_disabled');
    case 'auth/too-many-requests':
      return t('errors.too_many');
    case 'auth/email-already-in-use':
      return t('errors.email_in_use');
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return t('errors.invalid_credentials');
    case 'auth/weak-password':
      return t('errors.weak_password');
    case 'auth/invalid-email':
      return t('errors.invalid_email');
    case 'auth/invalid-phone-number':
    case 'auth/missing-phone-number':
      return t('errors.invalid_phone');
    case 'auth/invalid-verification-code':
    case 'auth/code-expired':
      return t('errors.invalid_code');
    default:
      return t('errors.failed');
  }
}

export function AuthForm({ mode, locale }: { mode: Mode; locale: string }) {
  const t = useTranslations('Auth');
  const tx = t as unknown as (k: string) => string; // для mapError (строковые ключи)
  const router = useRouter();
  const { user, signInWithGoogle, signUpWithEmail, signInWithEmail, resetPassword, startPhoneSignIn } = useAuth();

  const [method, setMethod] = useState<Method>('email');
  const [view, setView] = useState<View>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const showVerifyRef = useRef(false); // не редиректить при регистрации по email

  const profileHref = `/${locale}/personal/user-profile`;

  // Уже вошёл (или вошёл через Google/телефон/email-логин) → в профиль.
  useEffect(() => {
    if (user && !showVerifyRef.current) {
      router.replace(profileHref);
    }
  }, [user, profileHref, router]);

  const reset = () => {
    setError('');
    setInfo('');
  };

  const handleGoogle = async () => {
    reset();
    setPending(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(mapError(e, tx));
      setPending(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setPending(true);
    try {
      if (mode === 'signup') {
        showVerifyRef.current = true;
        await signUpWithEmail(email, password);
        setView('verify-email');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      showVerifyRef.current = false;
      setError(mapError(err, tx));
    } finally {
      setPending(false);
    }
  };

  const handleForgot = async () => {
    reset();
    if (!email) {
      setError(t('errors.invalid_email'));
      return;
    }
    try {
      await resetPassword(email);
      setInfo(t('reset_sent'));
    } catch (err) {
      setError(mapError(err, tx));
    }
  };

  const handleGetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setPending(true);
    try {
      confirmationRef.current = await startPhoneSignIn(normalizePhone(phone), 'recaptcha-container');
      setView('phone-code');
    } catch (err) {
      setError(mapError(err, tx));
    } finally {
      setPending(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setPending(true);
    try {
      await confirmationRef.current?.confirm(code);
      // вход произойдёт через onAuthStateChanged → редирект в useEffect
    } catch (err) {
      setError(mapError(err, tx));
      setPending(false);
    }
  };

  const field
    = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-sans text-base text-slate-800 outline-none transition focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20';

  // Экран «подтвердите почту».
  if (view === 'verify-email') {
    return (
      <Shell>
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-600">
            <MailCheck className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-sans text-2xl font-semibold tracking-tight text-slate-900">
            {t('verify_email_title')}
          </h1>
          <p className="mx-auto mt-3 max-w-xs font-sans text-sm leading-relaxed text-slate-500">
            {t('verify_email_text', { email })}
          </p>
          <button
            type="button"
            onClick={() => {
              showVerifyRef.current = false;
              router.replace(profileHref);
            }}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-violet-500 px-8 font-sans text-sm font-medium text-white shadow-sm transition-all hover:from-sky-700 hover:to-violet-600 hover:shadow-md"
          >
            {t('go_profile')}
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="text-center">
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {mode === 'signup' ? t('signup_title') : t('signin_title')}
        </h1>
        <p className="mt-2 font-sans text-sm text-slate-500">
          {mode === 'signup' ? t('signup_subtitle') : t('signin_subtitle')}
        </p>
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={pending}
        className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-4 font-sans text-base font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm disabled:opacity-50"
      >
        <FaGoogle className="h-5 w-5 text-[#EA4335]" />
        {t('google')}
      </button>

      {/* Разделитель */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="font-sans text-xs uppercase tracking-wide text-slate-400">{t('or')}</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Переключатель Email / Телефон */}
      <div className="flex rounded-full bg-slate-100 p-1">
        {(['email', 'phone'] as Method[]).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMethod(m);
              setView('form');
              reset();
            }}
            className={`flex-1 rounded-full py-2 font-sans text-sm font-medium transition-all ${
              method === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            {m === 'email' ? t('tab_email') : t('tab_phone')}
          </button>
        ))}
      </div>

      {/* Email */}
      {method === 'email' && (
        <form onSubmit={handleEmail} className="mt-5 space-y-3">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder={t('email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={field}
          />
          <input
            type="password"
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder={t('password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={field}
          />
          {mode === 'signin' && (
            <button
              type="button"
              onClick={handleForgot}
              className="block w-full text-right font-sans text-xs text-slate-400 transition-colors hover:text-slate-600"
            >
              {t('forgot_password')}
            </button>
          )}
          <button
            type="submit"
            disabled={pending}
            className="h-12 w-full rounded-full bg-gradient-to-r from-sky-600 to-violet-500 font-sans text-sm font-medium text-white shadow-sm transition-all hover:from-sky-700 hover:to-violet-600 hover:shadow-md disabled:opacity-50"
          >
            {pending ? t('processing') : mode === 'signup' ? t('signup_btn') : t('signin_btn')}
          </button>
        </form>
      )}

      {/* Телефон */}
      {method === 'phone' && view === 'form' && (
        <form onSubmit={handleGetCode} className="mt-5 space-y-3">
          <input
            type="tel"
            required
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className={field}
          />
          <button
            type="submit"
            disabled={pending}
            className="h-12 w-full rounded-full bg-gradient-to-r from-sky-600 to-violet-500 font-sans text-sm font-medium text-white shadow-sm transition-all hover:from-sky-700 hover:to-violet-600 hover:shadow-md disabled:opacity-50"
          >
            {pending ? t('sending') : t('get_code')}
          </button>
        </form>
      )}

      {method === 'phone' && view === 'phone-code' && (
        <form onSubmit={handleVerifyCode} className="mt-5 space-y-3">
          <p className="font-sans text-xs text-slate-500">{t('code_hint')}</p>
          <input
            inputMode="numeric"
            required
            maxLength={6}
            placeholder="••••••"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            className={`${field} text-center tracking-[0.5em]`}
          />
          <button
            type="submit"
            disabled={pending}
            className="h-12 w-full rounded-full bg-gradient-to-r from-sky-600 to-violet-500 font-sans text-sm font-medium text-white shadow-sm transition-all hover:from-sky-700 hover:to-violet-600 hover:shadow-md disabled:opacity-50"
          >
            {pending ? t('processing') : t('verify_code')}
          </button>
        </form>
      )}

      {/* Скрытый контейнер reCAPTCHA */}
      <div id="recaptcha-container" />

      {error && <p className="mt-4 text-center font-sans text-sm font-medium text-red-600">{error}</p>}
      {info && <p className="mt-4 text-center font-sans text-sm font-medium text-emerald-600">{info}</p>}

      {/* Переключение вход/регистрация */}
      <p className="mt-6 text-center font-sans text-sm text-slate-500">
        {mode === 'signup' ? t('have_account') : t('no_account')}
        {' '}
        <Link
          href={mode === 'signup' ? '/sign-in/' : '/sign-up/'}
          className="font-medium text-sky-600 hover:text-sky-700"
        >
          {mode === 'signup' ? t('to_signin') : t('to_signup')}
        </Link>
      </p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
