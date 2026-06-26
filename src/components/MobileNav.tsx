'use client';

import { avatarColor } from '@/libs/avatarColor';
import { useAuth } from '@/providers/AuthProvider';
import { AnimatePresence, motion } from 'framer-motion';
import { Home as HomeIcon, Info, LayoutGrid, LogIn, LogOut, MapPin, Menu, Phone, ShoppingBag, UserPlus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';

const TELEGRAM_URL = 'https://t.me/ssssielun';
const WHATSAPP_URL = 'https://wa.me/77472576393';
const PHONE_HREF = 'tel:+77472576393';

export function MobileNav() {
  const t = useTranslations('RootLayout');
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const close = () => setOpen(false);

  // Закрытие по Esc.
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Блокировка скролла страницы, пока меню открыто.
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Закрывать при смене маршрута.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const nav = [
    { href: '/', label: t('home_link'), Icon: HomeIcon },
    { href: '/products/', label: t('catalog_link'), Icon: LayoutGrid },
    { href: '/contacts/', label: t('contacts_link'), Icon: MapPin },
    { href: '/about/', label: t('about_link'), Icon: Info },
  ];

  const name = user?.displayName || user?.email?.split('@')[0] || 'User';
  const firstName = name.split(' ')[0] ?? name;

  const handleLogout = async () => {
    close();
    await logout();
    router.push('/');
  };

  const socials = [
    { Icon: FaTelegramPlane, label: 'Telegram', href: TELEGRAM_URL, color: '#229ED9' },
    { Icon: FaWhatsapp, label: 'WhatsApp', href: WHATSAPP_URL, color: '#25D366' },
    { Icon: Phone, label: 'Позвонить', href: PHONE_HREF, color: '#6D5DF6' },
  ];

  return (
    <>
      {/* Бургер */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Меню"
        className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
      >
        <Menu className="h-6 w-6" />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Затемнение фона */}
              <motion.button
                type="button"
                aria-label="Закрыть меню"
                onClick={close}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[90] bg-slate-900/30 backdrop-blur-sm"
              />

              {/* Панель меню */}
              <motion.div
                initial={{ x: '100%', opacity: 0.6 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0.6 }}
                transition={{ type: 'spring', stiffness: 360, damping: 38 }}
                className="fixed inset-y-0 right-0 z-[100] flex w-[min(86vw,360px)] flex-col rounded-l-[24px] border-l border-white/60 bg-white/80 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.4)] backdrop-blur-2xl"
              >
                {/* Шапка панели */}
                <div className="flex items-center justify-between px-5 pb-3 pt-5">
                  <span className="font-sans text-lg font-semibold tracking-[0.15em] text-slate-900">
                    BAIMED
                  </span>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Закрыть"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-2">
                  {nav.map(({ href, label, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={close}
                      className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 font-sans text-[17px] font-medium text-slate-800 transition-colors active:bg-slate-100 hover:bg-slate-100/80"
                    >
                      <Icon className="h-5 w-5 text-slate-400" strokeWidth={1.8} />
                      {label}
                    </Link>
                  ))}

                  <div className="my-3 h-px bg-slate-200/70" />

                  {user
                    ? (
                        <>
                          <Link
                            href="/personal/user-profile"
                            onClick={close}
                            className="flex items-center gap-3.5 rounded-2xl px-4 py-3 font-sans text-[17px] font-medium text-slate-800 transition-colors active:bg-slate-100 hover:bg-slate-100/80"
                          >
                            <span
                              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                              style={{ backgroundColor: avatarColor(firstName) }}
                            >
                              {firstName.charAt(0).toUpperCase()}
                            </span>
                            {t('profile_link')}
                          </Link>
                          <Link
                            href="/personal/user-profile"
                            onClick={close}
                            className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 font-sans text-[17px] font-medium text-slate-800 transition-colors active:bg-slate-100 hover:bg-slate-100/80"
                          >
                            <ShoppingBag className="h-5 w-5 text-slate-400" strokeWidth={1.8} />
                            {t('cart_link')}
                          </Link>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 font-sans text-[17px] font-medium text-red-600 transition-colors active:bg-red-50 hover:bg-red-50/80"
                          >
                            <LogOut className="h-5 w-5" strokeWidth={1.8} />
                            {t('logout_link')}
                          </button>
                        </>
                      )
                    : (
                        <>
                          <Link
                            href="/sign-in/"
                            onClick={close}
                            className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 font-sans text-[17px] font-medium text-slate-800 transition-colors active:bg-slate-100 hover:bg-slate-100/80"
                          >
                            <LogIn className="h-5 w-5 text-slate-400" strokeWidth={1.8} />
                            {t('sign_in_link')}
                          </Link>
                          <Link
                            href="/sign-up/"
                            onClick={close}
                            className="flex items-center gap-3.5 rounded-2xl bg-sky-600 px-4 py-3.5 font-sans text-[17px] font-semibold text-white transition-colors hover:bg-sky-700"
                          >
                            <UserPlus className="h-5 w-5" strokeWidth={1.8} />
                            {t('sign_up_link')}
                          </Link>
                        </>
                      )}
                </nav>

                {/* Соцсети */}
                <div className="flex items-center justify-center gap-3 border-t border-slate-200/70 px-5 py-4">
                  {socials.map(({ Icon, label, href, color }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform active:scale-95"
                      style={{ background: `${color}1a`, color }}
                    >
                      <Icon className="h-[22px] w-[22px]" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
