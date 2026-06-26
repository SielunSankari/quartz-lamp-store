'use client';

import { AppConfig } from '@/utils/AppConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaInstagram, FaTelegramPlane, FaTiktok, FaWhatsapp } from 'react-icons/fa';

type LinkItem = { label: string; href: string };

const SOCIALS = [
  { Icon: FaInstagram, href: 'https://instagram.com/baimed', label: 'Instagram' },
  { Icon: FaTiktok, href: 'https://tiktok.com/@baimed', label: 'TikTok' },
  { Icon: FaTelegramPlane, href: 'https://t.me/ssssielun', label: 'Telegram' },
  { Icon: FaWhatsapp, href: 'https://wa.me/77472576393', label: 'WhatsApp' },
];

// Колонка: на десктопе раскрыта всегда, на мобиле — аккордеон с плавным раскрытием.
function FooterColumn({ title, links }: { title: string; links: LinkItem[] }) {
  const [open, setOpen] = useState(false);

  const list = (
    <ul className="space-y-2.5">
      {links.map(l => (
        <li key={l.label}>
          <a
            href={l.href}
            className="inline-block text-[15px] font-normal text-slate-400 transition-colors duration-200 hover:text-white"
          >
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between py-4 text-left md:cursor-default md:py-0"
      >
        <h3 className="text-lg font-semibold tracking-wide text-white">{title}</h3>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform duration-300 md:hidden ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Десктоп — всегда раскрыто */}
      <div className="hidden md:mt-4 md:block">{list}</div>

      {/* Мобайл — аккордеон */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 30 }}
            className="overflow-hidden md:hidden"
          >
            <div className="pb-4">{list}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  const catalog = (t.raw('catalog') as string[]).map(label => ({ label, href: '/products' }));
  const company = (t.raw('company') as string[]).map(label => ({ label, href: '#' }));
  const buyers = (t.raw('buyers') as string[]).map(label => ({ label, href: '#' }));

  return (
    <footer className="relative mt-12 overflow-hidden bg-slate-950 text-slate-300 md:mt-16">
      {/* Мягкое УФ-свечение */}
      <div aria-hidden className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative mx-auto w-full max-w-[1100px] px-6 sm:px-10 lg:px-12"
      >
        {/* Колонки — собраны по центру компактной группой (~800px) */}
        <div className="mx-auto flex max-w-[800px] flex-col py-2 md:flex-row md:justify-center md:gap-16 md:pb-12 md:pt-8 lg:gap-24">
          <FooterColumn title={t('catalog_title')} links={catalog} />
          <FooterColumn title={t('company_title')} links={company} />
          <FooterColumn title={t('buyers_title')} links={buyers} />
        </div>

        {/* Бренд-блок + соцсети + копирайт */}
        <div className="flex flex-col items-center gap-5 border-t border-white/10 py-10 text-center">
          <div>
            <span className="font-sans text-xl font-semibold tracking-[0.25em] text-white">
              {AppConfig.name}
            </span>
            <p className="mx-auto mt-2 max-w-xs font-sans text-sm leading-relaxed text-slate-400">
              {t('tagline')}
            </p>
          </div>

          <div className="flex items-center gap-5">
            {SOCIALS.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-slate-500 transition-colors duration-200 hover:text-white"
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>

          <div className="mt-1 space-y-1">
            <p className="font-sans text-xs text-slate-500">
              ©
              {' '}
              2012–
              {year}
              {' '}
              {AppConfig.name}
              .
              {' '}
              {t('rights')}
            </p>
            <p className="font-sans text-xs text-slate-600">
              Made by
              {' '}
              <a
                href="https://github.com/SielunSankari"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors duration-200 hover:text-white"
              >
                Batyrzhan Baitubaev
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
