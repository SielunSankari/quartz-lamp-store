'use client';

import { useUserStore } from '@/stores/useUserStore';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const LoginForm = ({ locale }: { locale: string }) => {
  const t = useTranslations('SignIn');
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useUserStore(state => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('http://localhost:3001/sign-in', loginData, {
        withCredentials: true,
      });

      const userRes = await axios.get('http://localhost:3001/getUser', {
        withCredentials: true,
      });

      setUser(userRes.data?.username ? { username: userRes.data.username } : null);
      router.push(`/${locale}/personal/user-profile`);
    } catch (error: any) {
      setMessage(error.response?.data?.message || t('errors.login_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-lg w-full px-6 lg:px-8">
        <form onSubmit={handleLogin}>
          <div className="rounded-2xl bg-white shadow-xl p-7 lg:p-11">
            <div className="mb-11 text-center">
              <h1 className="text-3xl font-bold leading-10 text-gray-900">
                {t('title')}
              </h1>
              <p className="text-base font-normal leading-6 text-gray-500">
                {t('subtitle')}
              </p>
            </div>

            <input
              type="text"
              className="w-full h-12 rounded-full border-gray-300 px-4 text-lg leading-7 placeholder:text-gray-400 focus:outline-none border shadow-sm mb-4"
              placeholder={t('username')}
              value={loginData.username}
              onChange={e => setLoginData(prev => ({ ...prev, username: e.target.value }))}
            />

            <input
              type="password"
              className="w-full h-12 rounded-full border-gray-300 px-4 text-lg leading-7 placeholder:text-gray-400 focus:outline-none border shadow-sm"
              placeholder={t('password')}
              value={loginData.password}
              onChange={e => setLoginData(prev => ({ ...prev, password: e.target.value }))}
            />

            <div className="mb-4 flex justify-end">
              <Link
                href={`/${locale}/forgot-password`}
                className="text-base leading-8 text-violet-600"
              >
                {t('forgot_password')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mb-11 w-full h-12 rounded-full bg-violet-600 px-4 text-base font-semibold leading-6 text-white transition-all duration-700 hover:bg-violet-800 disabled:opacity-50"
            >
              {isLoading ? t('processing') : t('button')}
            </button>

            {message && (
              <p className="text-center text-red-700">
                <b>{message}</b>
              </p>
            )}

            <div className="text-center">
              <Link
                href={`/${locale}/sign-up`}
                className="text-base leading-6 text-gray-900 hover:text-violet-600"
              >
                {t('no_account')}
                {' '}
                <span className="font-semibold text-violet-600">{t('sign_up')}</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
