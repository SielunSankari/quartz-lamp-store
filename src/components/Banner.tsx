import { Ripple } from '@/components/magicui/ripple';
import { RotatingText } from '@/components/RotatingText';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

// Hero: слева — лампа, парящая вверх-вниз (без стеклянной панели);
// справа — текст. Холодная клиническая палитра, акцент — приятный sky-600.
const Banner = () => {
  const t = useTranslations('Hero');
  const qualities = t.raw('qualities') as string[];

  return (
    <section className="relative mb-16 overflow-hidden rounded-[2.5rem] bg-white md:mb-24">
      {/* Мягкие холодные акценты по углам (свечение самой лампы — Ripple ниже) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[18%] top-[14%] h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute bottom-[4%] right-[12%] h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-[45fr_55fr] md:gap-6 md:py-16">
        {/* ЛЕВО — парящая лампа; за ней пульсирующее УФ-свечение (Magic UI Ripple) */}
        <div className="relative flex justify-center md:justify-center md:pl-12">
          <Ripple className="md:left-6" />
          <Image
            src="/assets/images/lamp-hero.png"
            alt="Бактерицидная УФ-лампа BAIMED"
            width={704}
            height={1525}
            priority
            sizes="(max-width: 768px) 60vw, 30vw"
            className="float-slow relative z-10 h-[340px] w-auto object-contain drop-shadow-[0_30px_50px_rgba(56,128,255,0.22)] md:h-[540px]"
          />
        </div>

        {/* ПРАВО — текст */}
        <div className="text-center md:text-left">
          <p className="font-sans text-sm font-medium uppercase tracking-[0.25em] text-slate-500 md:text-base">
            {t('eyebrow')}
          </p>

          <h1 className="mt-2 font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            {t('title')}
          </h1>

          {/* Меняющиеся важные качества лампы */}
          <div className="mt-4 h-9 md:h-10">
            <RotatingText
              items={qualities}
              className="font-sans text-2xl font-medium tracking-tight text-sky-600 md:text-3xl"
            />
          </div>

          <p className="mx-auto mt-6 max-w-md font-sans text-base leading-relaxed text-slate-600 md:mx-0 md:text-lg">
            {t('subtitle')}
          </p>

          {/* CTA: каталог + Kaspi */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link href="/products/" className="inline-flex">
              <span className="cta-glass rounded-full px-9 py-4 text-base font-medium tracking-wide">
                {t('cta')}
              </span>
            </Link>

            <a
              href="https://kaspi.kz/shop/search/?q=%3AallMerchants%3A2401006"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/70 px-7 py-4 text-base font-medium tracking-wide text-slate-800 shadow-sm backdrop-blur transition-all duration-200 hover:bg-white hover:shadow-md"
            >
              <Image
                src="/assets/images/kaspi-logo.png"
                alt="Kaspi"
                width={22}
                height={22}
                className="shrink-0"
              />
              {t('cta_kaspi')}
            </a>
          </div>

          <p className="mt-8 font-sans text-xs tracking-wide text-slate-500 md:text-sm">
            {t('trust')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
