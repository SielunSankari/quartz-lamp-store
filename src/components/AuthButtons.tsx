'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaApple, FaGoogle } from 'react-icons/fa';

// Единый экран входа. Соц-логин (Google/Apple) одновременно и регистрирует,
// и логинит — отдельная форма регистрации не нужна.
export const AuthButtons = ({ locale }: { locale: string }) => {
  const t = useTranslations('SignIn');
  const router = useRouter();
  const { user, signInWithGoogle, signInWithApple } = useAuth();
  const [pending, setPending] = useState<null | 'google' | 'apple'>(null);
  const [error, setError] = useState('');

  // Если пользователь уже вошёл (или только что вошёл) — уводим в профиль.
  useEffect(() => {
    if (user) {
      router.replace(`/${locale}/personal/user-profile`);
    }
  }, [user, locale, router]);

  const handle = async (provider: 'google' | 'apple') => {
    setError('');
    setPending(provider);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
      // Редирект сделает useEffect выше, когда AuthProvider получит пользователя.
    } catch {
      setError(t('errors.login_failed'));
      setPending(null);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="max-w-md w-full px-6">
        <div className="rounded-2xl bg-white shadow-xl p-8 lg:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="mt-2 text-base text-gray-500">{t('subtitle')}</p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handle('google')}
              disabled={pending !== null}
              className="flex w-full h-12 items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-4 text-base font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <FaGoogle className="h-5 w-5 text-[#EA4335]" />
              {pending === 'google' ? t('signing_in') : t('continue_with_google')}
            </button>

            <button
              type="button"
              onClick={() => handle('apple')}
              disabled={pending !== null}
              className="flex w-full h-12 items-center justify-center gap-3 rounded-full bg-black px-4 text-base font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              <FaApple className="h-5 w-5" />
              {pending === 'apple' ? t('signing_in') : t('continue_with_apple')}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-center font-medium text-red-700">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};
