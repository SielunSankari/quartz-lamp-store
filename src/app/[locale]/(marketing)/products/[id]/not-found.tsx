import { useTranslations } from 'next-intl';
import Link from 'next/link';

// Показывается, когда товар не найден (getProduct → null → notFound()).
export default function NotFound() {
  const t = useTranslations('Common');

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-sans text-2xl font-semibold text-slate-900">{t('not_found_title')}</h1>
      <p className="mt-3 font-sans text-base text-slate-600">{t('not_found_text')}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gradient-to-r from-sky-600 to-violet-500 px-7 py-3 font-sans text-base font-medium text-white transition-colors hover:from-sky-700 hover:to-violet-600"
      >
        {t('go_home')}
      </Link>
    </div>
  );
}
