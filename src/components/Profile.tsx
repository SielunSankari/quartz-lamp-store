'use client';

import { avatarColor } from '@/libs/avatarColor';
import { getOrders } from '@/libs/orders';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { motion } from 'framer-motion';
import { Calendar, Package, ShoppingCart, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function Profile() {
  const t = useTranslations('Profile');
  const locale = useLocale();
  const { user, loading: authLoading } = useAuth();
  const { items, totalItems, totalPrice, loading: cartLoading, removeFromCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [ordersCount, setOrdersCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    getOrders(user.uid)
      .then(o => setOrdersCount(o.length))
      .catch(() => setOrdersCount(0));
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-sans text-lg text-slate-600">{t('login_required')}</p>
        <Link
          href="/sign-in/"
          className="inline-flex rounded-full bg-gradient-to-r from-sky-600 to-violet-500 px-6 py-2.5 font-sans text-sm font-medium text-white shadow-sm transition-all hover:from-sky-700 hover:to-violet-600 hover:shadow-md"
        >
          {t('login_button')}
        </Link>
      </div>
    );
  }

  const name = user.displayName || user.email?.split('@')[0] || 'User';
  const firstName = name.split(' ')[0] ?? name;
  const initial = firstName.charAt(0).toUpperCase();
  const color = avatarColor(firstName);
  const memberSince = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(locale === 'kz' ? 'kk-KZ' : 'ru-RU', {
        month: 'long',
        year: 'numeric',
      })
    : '-';

  const stats = [
    { Icon: Calendar, value: memberSince, label: t('member_since'), color: '#0284c7' },
    { Icon: Package, value: ordersCount ?? '-', label: t('orders_count'), color: '#6d5df6' },
    { Icon: ShoppingCart, value: totalItems, label: t('in_cart_count'), color: '#10b981' },
  ];

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
      window.location.href = url;
    } catch {
      setError(t('errors.checkout_error'));
      setCheckingOut(false);
    }
  };

  return (
    <div className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Приветственный блок */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5 rounded-[2rem] border border-white/60 bg-white/60 p-8 text-center shadow-[0_18px_50px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:flex-row sm:gap-6 sm:text-left md:p-10"
        >
          <motion.div
            initial={{ scale: 0.82, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.12, type: 'spring', stiffness: 260, damping: 18 }}
            className="flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-full text-4xl font-bold text-white shadow-lg ring-4 ring-white"
            style={{ backgroundColor: color }}
          >
            {initial}
          </motion.div>

          <div>
            <h1 className="font-sans text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {t('greeting', { name: firstName })}
            </h1>
            <p className="mt-1.5 font-sans text-sm text-slate-500">{user.email}</p>
          </div>
        </motion.div>

        {/* Статистика */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
          className="mt-5 grid grid-cols-3 gap-3 sm:gap-4"
        >
          {stats.map(s => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200/60 bg-white p-4 text-center sm:p-5"
            >
              <span
                className="mx-auto flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: `${s.color}1a`, color: s.color }}
              >
                <s.Icon className="h-[18px] w-[18px]" />
              </span>
              <div className="mt-3 font-sans text-sm font-semibold capitalize text-slate-900 sm:text-base">
                {s.value}
              </div>
              <div className="mt-0.5 font-sans text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Корзина */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
          className="mt-5 rounded-[2rem] border border-slate-200/60 bg-white p-6 md:p-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-xl font-semibold text-slate-900">{t('cart.title')}</h2>
            {items.length > 0 && (
              <span className="font-sans text-sm text-slate-400">
                {totalItems}
                {' '}
                {t('cart.pcs')}
              </span>
            )}
          </div>

          {cartLoading
            ? (
                <div className="mt-6 space-y-3">
                  {[0, 1].map(i => (
                    <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              )
            : items.length === 0
              ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <ShoppingCart className="h-6 w-6" />
                    </span>
                    <p className="font-sans text-slate-500">{t('cart.empty')}</p>
                    <Link
                      href="/products/"
                      className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-2.5 font-sans text-sm font-medium text-slate-800 shadow-sm transition-all hover:shadow-md"
                    >
                      {t('cart.go_catalog')}
                    </Link>
                  </div>
                )
              : (
                  <>
                    <div className="mt-6 space-y-3">
                      {items.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.04 * i, duration: 0.35 }}
                          whileHover={{ y: -2 }}
                          className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-3 transition-shadow duration-200 hover:shadow-md"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="h-16 w-16 object-contain p-1.5"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-sans text-sm font-medium text-slate-900">
                              {item.name}
                            </h3>
                            <p className="mt-0.5 font-sans text-xs text-slate-500">
                              {item.quantity}
                              {' '}
                              {t('cart.pcs')}
                              {' · '}
                              {item.price.toLocaleString('ru-RU')}
                              {' ₸ '}
                              {t('cart.each')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="whitespace-nowrap font-sans text-sm font-semibold text-slate-900">
                              {(item.price * item.quantity).toLocaleString('ru-RU')}
                              {' ₸'}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              aria-label={t('cart.remove')}
                              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="h-[18px] w-[18px]" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-4 border-t border-slate-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-sans text-xs text-slate-500">{t('cart.total_price')}</p>
                        <p className="font-sans text-2xl font-bold tracking-tight text-slate-900">
                          {totalPrice.toLocaleString('ru-RU')}
                          {' ₸'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={checkingOut}
                        className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-violet-500 px-8 font-sans text-sm font-medium text-white shadow-sm transition-all duration-200 hover:from-sky-700 hover:to-violet-600 hover:shadow-md disabled:opacity-50"
                      >
                        {checkingOut ? t('cart.processing') : t('cart.checkout')}
                      </button>
                    </div>
                  </>
                )}
        </motion.div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 font-sans text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
