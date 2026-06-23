'use client';

import { useEffect, useRef, useState } from 'react';

// Плавно сменяющиеся слова (важные качества лампы).
// По Apple HIG / WCAG:
//  • достаточно времени на чтение (~3.8 c);
//  • пауза при наведении (WCAG 2.2.2 «Pause, Stop, Hide»);
//  • при «Уменьшении движения» — статичный список без анимации (WCAG 2.3).
export const RotatingText = ({
  items,
  className,
  interval = 3800,
}: {
  items: string[];
  className?: string;
  interval?: number;
}) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const paused = useRef(false);

  // Следим за системной настройкой «Уменьшить движение».
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced || items.length <= 1) {
      return;
    }
    const id = setInterval(() => {
      if (paused.current) {
        return; // пауза при наведении
      }
      setVisible(false); // затухаем
      setTimeout(() => {
        setIndex(prev => (prev + 1) % items.length);
        setVisible(true); // показываем следующее
      }, 400);
    }, interval);
    return () => clearInterval(id);
  }, [reduced, items.length, interval]);

  // Reduce Motion — без движения, все качества сразу.
  if (reduced) {
    return <span className={className}>{items.join(' · ')}</span>;
  }

  return (
    <span
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
      className={`inline-block transition-all duration-[400ms] ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
      } ${className ?? ''}`}
    >
      {items[index]}
    </span>
  );
};
