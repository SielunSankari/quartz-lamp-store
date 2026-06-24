'use client';

import NumberFlow from '@number-flow/react';
import { useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

type StatLabel = { label: string; suffix: string };

// Число + формат — в коде, подпись/суффикс — из переводов.
const NUMERIC = [
  { target: 2012, format: { useGrouping: false } }, // год — без разделителя
  { target: 6, format: {} },
  { target: 99.9, format: { minimumFractionDigits: 1, maximumFractionDigits: 1 } },
  { target: 12000, format: { useGrouping: true } }, // 12 000
];

// Счётчики «Почему нам доверяют»: разряды плавно прокручиваются (как одометр)
// при попадании секции в viewport — один раз (Intersection Observer через useInView).
export function StatsCounters() {
  const t = useTranslations('Trust');
  const stats = t.raw('stats') as StatLabel[];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [values, setValues] = useState(() => NUMERIC.map(() => 0));

  useEffect(() => {
    if (inView) {
      setValues(NUMERIC.map(n => n.target));
    }
  }, [inView]);

  return (
    <div ref={ref} className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-16 md:grid-cols-4">
      {stats.map((s, i) => (
        <div key={s.label} className="text-center">
          <div className="font-sans text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            <NumberFlow
              value={values[i]!}
              format={NUMERIC[i]!.format}
              suffix={s.suffix}
              locales="ru-RU"
              spinTiming={{ duration: 2000, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
            />
          </div>
          <div className="mx-auto mt-2 max-w-[10rem] font-sans text-sm leading-snug text-slate-500">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
