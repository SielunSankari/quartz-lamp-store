import Branches from '@/components/Branches';
import { Clock, Mail, Phone } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FaWhatsapp } from 'react-icons/fa';

type IContactProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IContactProps) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Contacts' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Contacts(props: IContactProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Contacts' });

  const methods = [
    { Icon: Phone, label: t('phone_label'), value: t('phone_value'), href: 'tel:+77472576393', color: '#0284c7' },
    { Icon: FaWhatsapp, label: t('whatsapp_label'), value: t('whatsapp_value'), href: 'https://wa.me/77472576393', color: '#25D366' },
    { Icon: Mail, label: t('email_label'), value: t('email_value'), href: 'mailto:baimed@inbox.ru', color: '#6D5DF6' },
    { Icon: Clock, label: t('hours_label'), value: t('hours_value'), href: null, color: '#64748b' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      {/* Заголовок */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-sans text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          {t('title')}
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-sans text-lg leading-relaxed text-slate-600">
          {t('subtitle')}
        </p>
      </div>

      {/* Способы связи */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {methods.map(({ Icon, label, value, href, color }) => {
          const inner = (
            <>
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: `${color}1f`, color }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="mt-4 block font-sans text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                {label}
              </span>
              <span className="mt-1 block font-sans text-base font-medium text-slate-900">
                {value}
              </span>
            </>
          );
          const cls
            = 'rounded-3xl border border-slate-200/60 bg-white p-6 transition-all duration-200';
          return href
            ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`${cls} block hover:-translate-y-1 hover:shadow-md`}
                >
                  {inner}
                </a>
              )
            : (
                <div key={label} className={cls}>
                  {inner}
                </div>
              );
        })}
      </div>

      {/* Филиалы (карта + города) */}
      <Branches />
    </div>
  );
}
