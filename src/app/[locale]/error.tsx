'use client';

// Граница ошибок для страниц локали. Ловит сбои рендера (например, недоступность
// Firestore при загрузке каталога), показывает аккуратное сообщение с кнопкой
// повтора вместо падения всего приложения, и отправляет ошибку в Sentry.
import * as Sentry from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Common');

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-sans text-2xl font-semibold text-slate-900">{t('error_title')}</h1>
      <p className="mt-3 font-sans text-base text-slate-600">{t('error_text')}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full bg-gradient-to-r from-sky-600 to-violet-500 px-7 py-3 font-sans text-base font-medium text-white transition-colors hover:from-sky-700 hover:to-violet-600"
      >
        {t('retry')}
      </button>
    </div>
  );
}
