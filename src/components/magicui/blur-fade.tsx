'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

type BlurFadeProps = {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  yOffset?: number;
  blur?: string;
  inView?: boolean; // true = ждать появления в viewport; false = играть сразу
};

// Magic UI «Blur Fade»: элемент проявляется со снятием размытия + лёгким подъёмом.
export function BlurFade({
  children,
  className,
  duration = 0.5,
  delay = 0,
  yOffset = 8,
  blur = '8px',
  inView = false,
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: '-40px' });
  const isVisible = !inView || inViewResult;
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        hidden: reduced
          ? { opacity: 0 }
          : { y: yOffset, opacity: 0, filter: `blur(${blur})` },
        visible: reduced
          ? { opacity: 1 }
          : { y: 0, opacity: 1, filter: 'blur(0px)' },
      }}
      transition={{ delay: 0.04 + delay, duration, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
