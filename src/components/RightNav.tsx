'use client';

import { useUserStore } from '@/stores/useUserStore';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LocaleSwitcher } from './LocaleSwitcher';

export const RightNav = () => {
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
  const [isMounted, setIsMounted] = useState(false);

  const t = useTranslations('RootLayout');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  } // Или лоадер

  const logout = async () => {
    try {
      await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
    } finally {
      setUser(null); // persist middleware автоматически обновит localStorage
    }
  };

  return (
    <>
      {user
        ? (
            <>
              <li>
                <Link href="/personal/user-profile" className="text-gray-700 hover:text-gray-900">
                  {t('profile_link')}
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-gray-900 border-none bg-transparent"
                >
                  {t('logout_link')}
                </button>
              </li>
            </>
          )
        : (
            <>
              <li>
                <Link href="/sign-in/" className="text-gray-700 hover:text-gray-900">
                  {t('sign_in_link')}
                </Link>
              </li>
              <li>
                <Link href="/sign-up/" className="text-gray-700 hover:text-gray-900">
                  {t('sign_up_link')}
                </Link>
              </li>
            </>
          )}
      <li>
        <LocaleSwitcher />
      </li>
    </>
  );
};
