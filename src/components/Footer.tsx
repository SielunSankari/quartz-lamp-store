'use client';

import { AppConfig } from '@/utils/AppConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaInstagram, FaTelegramPlane, FaTiktok, FaWhatsapp, FaYoutube } from 'react-icons/fa';

type LinkItem = { label: string; href: string };

const SOCIALS = [
  { Icon: FaInstagram, href: 'https://instagram.com/baimed', label: 'Instagram' },
  { Icon: FaTiktok, href: 'https://tiktok.com/@baimed', label: 'TikTok' },
  { Icon: FaYoutube, href: 'https://youtube.com/@baimed', label: 'YouTube' },
  { Icon: FaTelegramPlane, href: 'https://t.me/baimed', label: 'Telegram' },
  { Icon: FaWhatsapp, href: 'https://wa.me/77000000000', label: 'WhatsApp' },
];

// Колонка: на десктопе раскрыта всегда, на мобиле — аккордеон с плавным раскрытием.
function FooterColumn({ title, body }: { title: string; body: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between py-4 text-left md:cursor-default md:py-0"
      >
        <h3 className="text-sm font-semibold tracking-wide text-white">{title}</h3>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform duration-300 md:hidden ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Десктоп — всегда раскрыто */}
      <div className="hidden md:mt-5 md:block">{body}</div>

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
            <div className="pb-5">{body}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LinkList({ links }: { links: LinkItem[] }) {
  return (
    <ul className="space-y-3">
      {links.map(l => (
        <li key={l.label}>
          <a
            href={l.href}
            className="inline-block text-sm font-normal text-slate-400 transition-colors duration-200 hover:text-white"
          >
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  const trust = t.raw('trust') as string[];
  const catalog = (t.raw('catalog') as string[]).map(label => ({ label, href: '/products' }));
  const company = (t.raw('company') as string[]).map(label => ({ label, href: '#' }));
  const buyers = (t.raw('buyers') as string[]).map(label => ({ label, href: '#' }));

  const contactsBody = (
    <ul className="space-y-3.5">
      <li>
        <a href="tel:+77000000000" className="flex items-center gap-2.5 text-sm text-slate-400 transition-colors hover:text-white">
          <Phone className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.8} />
          {t('phone_value')}
        </a>
      </li>
      <li>
        <a href="https://wa.me/77000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-slate-400 transition-colors hover:text-white">
          <FaWhatsapp className="h-4 w-4 shrink-0 text-slate-500" />
          {t('whatsapp_label')}
        </a>
      </li>
      <li>
        <a href="mailto:info@baimed.kz" className="flex items-center gap-2.5 text-sm text-slate-400 transition-colors hover:text-white">
          <Mail className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.8} />
          {t('email_value')}
        </a>
      </li>
      <li>
        <span className="flex items-start gap-2.5 text-sm text-slate-400">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.8} />
          {t('address_value')}
        </span>
      </li>
      <li>
        <span className="flex items-center gap-2.5 text-sm text-slate-400">
          <Clock className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.8} />
          {t('hours_value')}
        </span>
      </li>
    </ul>
  );

  return (
    <footer className="relative mt-12 overflow-hidden bg-slate-950 text-slate-300 md:mt-16">
      {/* Мягкое УФ-свечение и тонкая верхняя линия */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16"
      >
        {/* Полоса доверия */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-white/10 py-10 md:grid-cols-4 md:py-12">
          {trust.map(item => (
            <div key={item} className="flex items-center justify-center gap-2.5 md:justify-start">
              <Check className="h-4 w-4 shrink-0 text-sky-400" strokeWidth={2.4} />
              <span className="text-sm text-slate-300">{item}</span>
            </div>
          ))}
        </div>

        {/* Колонки */}
        <div className="grid gap-x-8 py-6 md:grid-cols-4 md:py-20">
          <FooterColumn title={t('catalog_title')} body={<LinkList links={catalog} />} />
          <FooterColumn title={t('company_title')} body={<LinkList links={company} />} />
          <FooterColumn title={t('buyers_title')} body={<LinkList links={buyers} />} />
          <FooterColumn title={t('contacts_title')} body={contactsBody} />
        </div>

        {/* Нижний блок */}
        <div className="flex flex-col items-center gap-6 border-t border-white/10 py-12 text-center md:py-16">
          <span className="font-sans text-2xl font-semibold tracking-[0.3em] text-white">
            {AppConfig.name}
          </span>
          <p className="max-w-md font-sans text-sm leading-relaxed text-slate-400">
            {t('tagline')}
          </p>

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

          <p className="mt-2 font-sans text-xs text-slate-500">
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
      </motion.div>
    </footer>
  );
}
