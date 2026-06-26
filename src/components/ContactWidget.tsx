'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Phone, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';

// Контактные данные.
const PHONE = '8 (747) 257-63-93';
const TELEGRAM_URL = 'https://t.me/ssssielun';
const WHATSAPP_URL = 'https://wa.me/77472576393';
const PHONE_HREF = 'tel:+77472576393';

export function ContactWidget() {
  const t = useTranslations('ContactFab');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const rows = [
    { key: 'tg', Icon: FaTelegramPlane, label: 'Telegram', sub: t('telegram_sub'), href: TELEGRAM_URL, color: '#229ED9' },
    { key: 'wa', Icon: FaWhatsapp, label: 'WhatsApp', sub: t('whatsapp_sub'), href: WHATSAPP_URL, color: '#25D366' },
    { key: 'call', Icon: Phone, label: t('call'), sub: PHONE, href: PHONE_HREF, color: '#6D5DF6' },
  ];

  return (
    <div
      ref={ref}
      className="fixed bottom-8 right-6 z-[70] flex flex-col items-end gap-3 sm:bottom-10 sm:right-8"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.82, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            style={{ transformOrigin: 'bottom right' }}
            className="w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-[24px] border border-white/60 bg-white/70 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.32)] backdrop-blur-[20px]"
          >
            <div className="px-5 pb-2 pt-4">
              <p className="font-sans text-base font-semibold tracking-tight text-slate-900">
                {t('title')}
              </p>
              <p className="mt-0.5 font-sans text-xs text-slate-500">{t('subtitle')}</p>
            </div>

            <div className="p-2">
              {rows.map(r => (
                <a
                  key={r.key}
                  href={r.href}
                  target={r.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-200 hover:bg-white/70"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ background: `${r.color}1f`, color: r.color }}
                  >
                    <r.Icon className="h-[22px] w-[22px]" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-sans text-sm font-semibold text-slate-900">{r.label}</span>
                    <span className="font-sans text-xs text-slate-500">{r.sub}</span>
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Один стеклянный FAB */}
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={t('title')}
        aria-expanded={open}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="flex h-[62px] w-[62px] items-center justify-center rounded-full border border-white/60 bg-white/60 text-sky-600 shadow-[0_12px_34px_-8px_rgba(15,23,42,0.38)] backdrop-blur-xl transition-colors duration-200 hover:bg-white/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open
            ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="h-6 w-6" strokeWidth={2.2} />
                </motion.span>
              )
            : (
                <motion.span
                  key="msg"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <MessageCircle className="h-[26px] w-[26px]" strokeWidth={2} />
                </motion.span>
              )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
