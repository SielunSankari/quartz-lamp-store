'use client';

import axios from 'axios';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const RegisterForm = ({ locale }: { locale: string }) => {
  const t = useTranslations('SignUp');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:3001/sign-up',
        formData,
        { withCredentials: true },
      );

      if (response.data === 'User already exists') {
        setMessage(t('errors.user_exists'));
      } else {
        router.push(`/${locale}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(t('errors.registration_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-lg w-full px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl bg-white shadow-xl p-7 lg:p-11">
            <div className="mb-11 text-center">
              <h1 className="text-3xl font-bold leading-10 text-gray-900">
                {t('title')}
              </h1>
              <p className="text-base font-normal leading-6 text-gray-500">
                {t('subtitle')}
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                className="w-full h-12 rounded-full border-gray-300 px-4 text-lg leading-7 placeholder:text-gray-400 focus:outline-none border shadow-sm"
                placeholder={t('username')}
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                required
              />

              <input
                type="password"
                className="w-full h-12 rounded-full border-gray-300 px-4 text-lg leading-7 placeholder:text-gray-400 focus:outline-none border shadow-sm"
                placeholder={t('password')}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full h-12 rounded-full bg-violet-600 px-4 text-base font-semibold leading-6 text-white transition-all duration-700 hover:bg-violet-800 disabled:opacity-50 shadow-sm"
            >
              {isLoading ? t('processing') : t('button')}
            </button>

            {message && (
              <p className="text-center text-red-700 mt-4 font-medium">
                <b>{message}</b>
              </p>
            )}

            <div className="text-center mt-6">
              <Link
                href={`/${locale}/sign-in`}
                className="text-base leading-6 text-gray-900 hover:text-violet-600"
              >
                {t('already_have_account')}
                {' '}
                <span className="font-semibold text-violet-600">{t('sign_in')}</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
