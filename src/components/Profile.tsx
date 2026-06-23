'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

export default function UserProfilePage() {
  const t = useTranslations('Profile');
  const { user, loading: authLoading } = useAuth();
  const { items, totalItems, totalPrice, loading: cartLoading, removeFromCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');

  // 1. Пока проверяем авторизацию — показываем лоадер.
  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  // 2. Гость без входа — мягко предлагаем войти.
  if (!user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg text-gray-600">{t('login_required')}</p>
        <Link href="/sign-in/">
          <Button>{t('login_button')}</Button>
        </Link>
      </div>
    );
  }

  // 3. Оформление заказа: создаём Stripe Checkout Session на сервере и уходим на оплату.
  const handleCheckout = async () => {
    setError('');
    setCheckingOut(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('checkout_failed');
      }

      const { url } = await res.json();
      window.location.href = url; // редирект на оплату Stripe
    } catch {
      setError(t('errors.checkout_error'));
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.displayName
              ? t('welcome_message', { username: user.displayName })
              : t('profile')}
          </h1>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-2xl font-semibold mb-6">{t('cart.title')}</h2>

          {cartLoading
            ? (
                <p className="text-gray-500 text-center">…</p>
              )
            : items.length === 0
              ? (
                  <div className="text-center space-y-4">
                    <p className="text-gray-500">{t('cart.empty')}</p>
                    <Link href="/products/">
                      <Button variant="outline">{t('cart.go_catalog')}</Button>
                    </Link>
                  </div>
                )
              : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <p className="text-gray-500">
                            {t('cart.quantity')}
                            :
                            {' '}
                            {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-6">
                          <p className="font-medium text-xl">
                            {(item.price * item.quantity).toLocaleString('ru-RU')}
                            {' '}
                            ₸
                          </p>
                          <Button
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 text-base"
                          >
                            <TrashIcon className="h-5 w-5 mr-2" />
                            {t('cart.remove')}
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="pt-6 mt-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">
                          {t('cart.total_items')}
                          :
                          {' '}
                          {totalItems}
                        </p>
                        <p className="text-xl font-bold mt-2">
                          {t('cart.total_price')}
                          :
                          {' '}
                          {totalPrice.toLocaleString('ru-RU')}
                          {' '}
                          ₸
                        </p>
                      </div>
                      <Button
                        className="bg-violet-600 text-white px-8 py-6 text-lg rounded-lg hover:bg-violet-700"
                        onClick={handleCheckout}
                        disabled={checkingOut}
                      >
                        {checkingOut ? t('cart.processing') : t('cart.checkout')}
                      </Button>
                    </div>
                  </div>
                )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
