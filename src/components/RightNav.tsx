'use client';

import { useAuth } from '@/providers/AuthProvider';
import { LogIn, LogOut, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LocaleSwitcher } from './LocaleSwitcher';

// Иконка-кнопка с подсказкой: круглая зона, мягкая hover-«таблетка».
const iconBtn
  = 'flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900';

export const RightNav = () => {
  const { user, loading, logout } = useAuth();
  const t = useTranslations('RootLayout');

  return (
    <>
      {!loading && user
        ? (
            <>
              <li>
                <Link
                  href="/personal/user-profile"
                  aria-label={t('profile_link')}
                  title={t('profile_link')}
                  className={iconBtn}
                >
                  <User className="h-5 w-5" />
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => logout()}
                  aria-label={t('logout_link')}
                  title={t('logout_link')}
                  className={`${iconBtn} border-none bg-transparent`}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </li>
            </>
          )
        : (
            <li>
              <Link
                href="/sign-in/"
                aria-label={t('sign_in_link')}
                title={t('sign_in_link')}
                className={iconBtn}
              >
                <LogIn className="h-5 w-5" />
              </Link>
            </li>
          )}
      <li>
        <LocaleSwitcher />
      </li>
    </>
  );
};
