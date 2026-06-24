'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/providers/AuthProvider';
import { ChevronDown, LogOut, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';

// Приятные приглушённые «эпловские» цвета аватара (белый текст читается).
const AVATAR_COLORS = [
  '#6C8EBF',
  '#E07A5F',
  '#81B29A',
  '#9A8C98',
  '#E0A458',
  '#5E8C7E',
  '#B084CC',
  '#5C9EAD',
  '#D88C9A',
  '#7C9D96',
];

// Детерминированный цвет из имени: одно имя → всегда один цвет.
function colorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!;
}

export const RightNav = () => {
  const { user, loading, logout } = useAuth();
  const t = useTranslations('RootLayout');
  const router = useRouter();

  const name = user?.displayName || user?.email?.split('@')[0] || 'User';
  const firstName = name.split(' ')[0] ?? name;
  const initial = firstName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      <li>
        <LocaleSwitcher />
      </li>

      <li>
        {!loading && user
          ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="group flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 py-1 pl-1 pr-3 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: colorFromName(firstName) }}
                    >
                      {initial}
                    </span>
                    <span className="max-w-[8rem] truncate font-sans text-sm font-medium text-slate-800">
                      {firstName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/personal/user-profile">
                      <ShoppingBag className="h-[18px] w-[18px] text-slate-500" />
                      {t('cart_link')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={handleLogout}
                    className="text-red-600 focus:bg-red-50 focus:text-red-700"
                  >
                    <LogOut className="h-[18px] w-[18px]" />
                    {t('logout_link')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          : (
              <Button
                asChild
                variant="ghost"
                className="h-9 rounded-full border border-slate-200/80 bg-white/80 px-5 text-sm font-medium text-slate-800 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-slate-900 hover:shadow-md"
              >
                <Link href="/sign-in/">{t('sign_in_link')}</Link>
              </Button>
            )}
      </li>
    </>
  );
};
