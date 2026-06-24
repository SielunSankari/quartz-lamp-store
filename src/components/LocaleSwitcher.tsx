'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { routing, usePathname, useRouter } from '@/libs/i18nNavigation';
import { Check, Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

type Locale = 'ru' | 'kz';

const LABELS: Record<Locale, string> = {
  ru: 'Русский',
  kz: 'Қазақша',
};

// Тихая иконка-глобус с мини-меню KZ/RU (тот же дропдаун, что у профиля).
// Часть кластера действий справа, не отдельный «остров». Смена — soft-навигация.
export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const [, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === locale) {
      return;
    }
    startTransition(() => router.replace(pathname, { locale: next }));
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Язык интерфейса"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
        >
          <Globe className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[11rem]">
        {(routing.locales as Locale[]).map(code => (
          <DropdownMenuItem
            key={code}
            onSelect={() => change(code)}
            className="justify-between"
          >
            <span className="font-sans">{LABELS[code]}</span>
            {code === locale && <Check className="h-4 w-4 text-sky-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
