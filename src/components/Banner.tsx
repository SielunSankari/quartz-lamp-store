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
    <section className="relative mb-10 overflow-hidden rounded-[2rem] bg-white sm:mb-16 sm:rounded-[2.5rem] md:mb-24">
      {/* Мягкие холодные акценты по углам (свечение самой лампы — Ripple ниже) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[18%] top-[14%] h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute bottom-[4%] right-[12%] h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-5 px-4 py-8 sm:gap-8 sm:py-12 md:grid-cols-[45fr_55fr] md:gap-6 md:py-16">
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
            className="float-slow relative z-10 h-[200px] w-auto object-contain drop-shadow-[0_30px_50px_rgba(56,128,255,0.22)] sm:h-[300px] md:h-[540px]"
          />
        </div>

        {/* ПРАВО — текст */}
        <div className="text-center md:text-left">
          <p className="font-sans text-sm font-medium uppercase tracking-[0.25em] text-slate-500 md:text-base">
            {t('eyebrow')}
          </p>

          <h1 className="mt-2 font-sans text-3xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            {t('title')}
          </h1>

          {/* Меняющиеся важные качества лампы */}
          <div className="mt-3 h-8 sm:mt-4 sm:h-9 md:h-10">
            <RotatingText
              items={qualities}
              className="bg-gradient-to-r from-sky-600 to-violet-500 bg-clip-text font-sans text-xl font-medium tracking-tight text-transparent sm:text-2xl md:text-3xl"
            />
          </div>

          <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-slate-600 sm:mt-6 md:mx-0 md:text-lg">
            {t('subtitle')}
          </p>

          {/* CTA: каталог + Kaspi (на мобиле в столбик во всю ширину) */}
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center md:justify-start">
            <Link href="/products/" className="w-full sm:w-auto">
              <span className="block w-full rounded-full bg-gradient-to-r from-sky-600 to-violet-500 px-7 py-3.5 text-center text-base font-medium tracking-wide text-white shadow-sm transition-all duration-200 hover:from-sky-700 hover:to-violet-600 hover:shadow-md sm:w-auto sm:px-9 sm:py-4">
                {t('cta')}
              </span>
            </Link>

            <a
              href="https://kaspi.kz/shop/search/?q=%3AallMerchants%3A2401006"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-200/80 bg-white/70 px-5 py-3.5 text-base font-medium tracking-wide text-slate-800 shadow-sm backdrop-blur transition-all duration-200 hover:bg-white hover:shadow-md sm:w-auto sm:px-7 sm:py-4"
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

            <a
              href="https://halykmarket.kz/astana/category/kvarcevye-lampy-i-obluchateli?f=merchantName%3ABAIMED"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-200/80 bg-white/70 px-5 py-3.5 text-base font-medium tracking-wide text-slate-800 shadow-sm backdrop-blur transition-all duration-200 hover:bg-white hover:shadow-md sm:w-auto sm:px-7 sm:py-4"
            >
              <Image
                src="/assets/images/halyk-logo.png"
                alt="Halyk Market"
                width={22}
                height={22}
                className="shrink-0 rounded-[5px]"
              />
              {t('cta_halyk')}
            </a>
          </div>

          <p className="mt-6 font-sans text-xs tracking-wide text-slate-500 sm:mt-8 md:text-sm">
            {t('trust')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
