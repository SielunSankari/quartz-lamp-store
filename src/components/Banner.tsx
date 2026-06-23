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
    <section className="relative overflow-hidden rounded-[2.5rem] bg-white">
      {/* Сине-фиолетовый озоновый ореол по центру за лампой (УФ = «за фиолетом») */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[23rem] w-[23rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/45 blur-3xl md:left-[34%]" />
        <div className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-[42%] -translate-y-[58%] rounded-full bg-violet-300/35 blur-3xl md:left-[38%]" />
        <div className="absolute left-[20%] top-[16%] h-64 w-64 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute bottom-[4%] right-[12%] h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-6 md:py-16">
        {/* ЛЕВО — парящая лампа, без обводки (сдвинута правее) */}
        <div className="flex justify-center md:justify-center md:pl-12">
          <Image
            src="/assets/images/lamp-hero.png"
            alt="Бактерицидная УФ-лампа BAIMED"
            width={704}
            height={1525}
            priority
            sizes="(max-width: 768px) 60vw, 30vw"
            className="float-slow h-[340px] w-auto object-contain drop-shadow-[0_30px_50px_rgba(56,128,255,0.22)] md:h-[540px]"
          />
        </div>

        {/* ПРАВО — текст */}
        <div className="text-center md:text-left">
          <p className="font-sans text-sm font-medium uppercase tracking-[0.25em] text-slate-500 md:text-base">
            {t('eyebrow')}
          </p>

          <h1 className="mt-2 font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
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

          {/* Стеклянный CTA */}
          <Link href="/products/" className="mt-8 inline-flex">
            <span className="cta-glass rounded-full px-9 py-4 text-base font-medium tracking-wide">
              {t('cta')}
            </span>
          </Link>

          <p className="mt-8 font-sans text-xs tracking-wide text-slate-500 md:text-sm">
            {t('trust')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
