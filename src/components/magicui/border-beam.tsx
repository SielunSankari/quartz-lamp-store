'use client';

import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';

type BorderBeamProps = {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
};

// Magic UI «Border Beam»: световой блик едет вдоль границы элемента (offset-path).
// Маска ограничивает свечение тонкой рамкой. УФ-градиент cyan → violet.
export function BorderBeam({
  size = 60,
  duration = 5,
  delay = 0,
  colorFrom = '#38bdf8',
  colorTo = '#a78bfa',
  className,
}: BorderBeamProps) {
  const reduced = useReducedMotion();

  // При «Уменьшить движение» бесконечный бегущий луч не показываем.
  if (reduced) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cn(
          'absolute aspect-square bg-gradient-to-l from-[var(--beam-from)] via-[var(--beam-to)] to-transparent',
          className,
        )}
        style={{
          'width': size,
          'offsetPath': `rect(0 auto auto 0 round ${size}px)`,
          '--beam-from': colorFrom,
          '--beam-to': colorTo,
        } as CSSProperties}
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: '100%' }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay: -delay,
        }}
      />
    </div>
  );
}
