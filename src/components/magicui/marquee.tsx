import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type MarqueeProps = ComponentPropsWithoutRef<'div'> & {
  reverse?: boolean;
  pauseOnHover?: boolean;
  repeat?: number;
  duration?: string; // напр. '80s'
  gap?: string; // напр. '1.5rem'
};

// Magic UI «Marquee» (= Aceternity «Infinite Moving Cards»): бесконечная лента.
// CSS-переменные задаём инлайн-стилем — так они точно доезжают до .animate-marquee.
export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
  repeat = 4,
  duration = '40s',
  gap = '1.5rem',
  style,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      style={{ '--duration': duration, '--gap': gap, ...style } as CSSProperties}
      className={cn('group flex flex-row overflow-hidden p-2 [gap:var(--gap)]', className)}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn('animate-marquee flex shrink-0 flex-row justify-around [gap:var(--gap)]', {
            'group-hover:[animation-play-state:paused]': pauseOnHover,
            '[animation-direction:reverse]': reverse,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
