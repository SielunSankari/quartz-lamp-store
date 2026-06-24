import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type RippleProps = {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
};

// Magic UI «Ripple», портировано под Tailwind v4 и подкрашено в УФ (cyan → violet).
// Концентрические пульсирующие волны = эмиссия ультрафиолета/озона от лампы.
export function Ripple({
  mainCircleSize = 200,
  mainCircleOpacity = 0.22,
  numCircles = 7,
  className,
}: RippleProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 select-none [mask-image:radial-gradient(circle,white,transparent_72%)]',
        className,
      )}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 80;
        const opacity = Math.max(mainCircleOpacity - i * 0.03, 0);
        const hue = 200 + (i / Math.max(numCircles - 1, 1)) * 70; // cyan → violet
        const borderOpacity = 0.06 + i * 0.05;

        return (
          <div
            key={size}
            className="animate-ripple absolute left-1/2 top-1/2 rounded-full border"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              animationDelay: `${i * 0.12}s`,
              borderWidth: '1px',
              borderColor: `hsl(${hue} 90% 65% / ${borderOpacity})`,
              backgroundColor: `hsl(${hue} 90% 70% / 0.04)`,
              transform: 'translate(-50%, -50%) scale(1)',
            } as CSSProperties}
          />
        );
      })}
    </div>
  );
}
