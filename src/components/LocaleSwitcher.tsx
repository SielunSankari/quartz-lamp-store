'use client';

import { routing, usePathname } from '@/libs/i18nNavigation';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

type Locale = 'ru' | 'kz';

// Сегментированный тумблер языка (Apple segmented control): для 2 языков
// чище и понятнее, чем флаг с дропдауном. Активный — белая «таблетка».
export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;

  const change = (next: Locale) => {
    if (next === locale) {
      return;
    }
    router.push(`/${next}${pathname}`);
    router.refresh();
  };

  return (
    <div
      role="group"
      aria-label="Язык интерфейса"
      className="inline-flex items-center gap-0.5 rounded-full border border-slate-200/80 bg-slate-100/70 p-0.5 backdrop-blur-sm"
    >
      {(routing.locales as Locale[]).map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => change(code)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
              active
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
};
