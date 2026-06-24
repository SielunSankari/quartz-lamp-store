'use client';

import type { LucideIcon } from 'lucide-react';
import { BlurFade } from '@/components/magicui/blur-fade';
import { Dna, Sun, Wind } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IoWarningOutline } from 'react-icons/io5';

type Step = { title: string; text: string };

const ICONS: LucideIcon[] = [Sun, Dna, Wind];

const WorkingPrinciple = () => {
  const t = useTranslations('WorkingPrinciple');
  const steps = t.raw('steps') as Step[];

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {t.rich('title', {
              highlight: chunks => <span className="text-sky-600">{chunks}</span>,
            })}
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-slate-500 md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Процесс из 3 шагов со связующей линией */}
        <div className="relative mx-auto mt-20 max-w-4xl md:mt-24">
          <div
            aria-hidden
            className="absolute left-[16.66%] right-[16.66%] top-12 hidden h-px bg-gradient-to-r from-sky-200 via-violet-200 to-sky-200 md:block"
          />

          <div className="grid gap-16 sm:grid-cols-3 md:gap-10">
            {steps.map((s, i) => {
              const Icon = ICONS[i] ?? ICONS[0]!;
              return (
                <BlurFade key={s.title} delay={0.1 + i * 0.14} className="flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-slate-200/80 bg-white shadow-sm">
                    <Icon className="h-11 w-11 text-sky-600" strokeWidth={1.5} />
                  </div>

                  <span className="mt-7 font-sans text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {`0${i + 1}`}
                  </span>
                  <h3 className="mt-2 font-sans text-2xl font-semibold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-[20rem] font-sans text-base leading-relaxed text-slate-500">
                    {s.text}
                  </p>
                </BlurFade>
              );
            })}
          </div>
        </div>

        {/* Тихое предупреждение */}
        <p className="mx-auto mt-20 flex max-w-md items-center justify-center gap-2 text-center font-sans text-sm text-slate-400">
          <IoWarningOutline className="h-4 w-4 shrink-0 text-amber-400" />
          {t('warning')}
        </p>
      </div>
    </section>
  );
};

export default WorkingPrinciple;
