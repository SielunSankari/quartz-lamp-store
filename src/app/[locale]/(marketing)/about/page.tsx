import { CertificateViewer } from '@/components/CertificateViewer';
import { Check, MapPin } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

type IAboutProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IAboutProps) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'About' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function About(props: IAboutProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'About' });

  const stats = t.raw('stats') as { value: string; label: string }[];
  const advantages = t.raw('advantages') as string[];
  const usage = t.raw('usage') as string[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      {/* Заголовок + лид */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-sans text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          {t('title')}
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-sans text-lg leading-relaxed text-slate-600">
          {t('lead')}
        </p>
      </div>

      {/* Цифры */}
      <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <div className="font-sans text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {s.value}
            </div>
            <div className="mx-auto mt-2 max-w-[10rem] font-sans text-sm leading-snug text-slate-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Чем занимаемся */}
      <section className="mt-16 rounded-[2rem] border border-slate-200/60 bg-white p-8 md:p-12">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-slate-900">
          {t('what_title')}
        </h2>
        <p className="mt-4 font-sans text-base leading-relaxed text-slate-600 md:text-lg">
          {t('what_text')}
        </p>
      </section>

      {/* Почему BAIMED */}
      <section className="mt-12">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-slate-900">
          {t('why_title')}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {advantages.map(a => (
            <div
              key={a}
              className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white p-5 font-sans text-base text-slate-700"
            >
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" strokeWidth={2.2} />
              {a}
            </div>
          ))}
        </div>
      </section>

      {/* Где используется */}
      <section className="mt-12">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-slate-900">
          {t('usage_title')}
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {usage.map(u => (
            <div
              key={u}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white p-5 font-sans text-base text-slate-700"
            >
              <MapPin className="h-5 w-5 shrink-0 text-sky-500" strokeWidth={1.8} />
              {u}
            </div>
          ))}
        </div>
      </section>

      {/* Сертификаты */}
      <section className="mt-16 flex flex-col items-center gap-8 rounded-[2rem] border border-slate-200/60 bg-slate-50/70 p-8 text-center md:flex-row md:gap-10 md:p-12 md:text-left">
        <div className="flex shrink-0 items-center justify-center gap-4">
          <CertificateViewer src="/assets/images/Certificate.jpg" alt={t('certificate_alt')} />
          <CertificateViewer src="/assets/images/Attestat-UF-lampyi.png" alt={t('attestat_alt')} />
        </div>
        <div>
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-slate-900">
            {t('certificate_title')}
          </h2>
          <p className="mt-3 max-w-md font-sans text-base leading-relaxed text-slate-600">
            {t('certificate_text')}
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <Link href="/products/" className="inline-flex">
          <span className="cta-glass rounded-full px-9 py-4 text-base font-medium tracking-wide">
            {t('cta_catalog')}
          </span>
        </Link>
        <a
          href="https://kaspi.kz/shop/search/?q=%3AallMerchants%3A2401006"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/70 px-7 py-4 text-base font-medium tracking-wide text-slate-800 shadow-sm backdrop-blur transition-all duration-200 hover:bg-white hover:shadow-md"
        >
          <Image src="/assets/images/kaspi-logo.png" alt="Kaspi" width={22} height={22} className="shrink-0" />
          {t('cta_kaspi')}
        </a>
      </div>
    </div>
  );
}
