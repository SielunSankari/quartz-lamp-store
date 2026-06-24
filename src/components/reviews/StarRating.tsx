'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

type Props = {
  value: number;
  onChange?: (v: number) => void; // если задан — интерактивный выбор оценки
  size?: number;
  className?: string;
};

// Звёзды (Lucide), брендовый violet. Режим отображения или выбора оценки.
export function StarRating({ value, onChange, size = 18, className }: Props) {
  const [hover, setHover] = useState(0);
  const interactive = Boolean(onChange);
  const shown = hover || value;

  return (
    <div className={`flex items-center gap-0.5 ${className ?? ''}`} aria-label="Оценка">
      {[1, 2, 3, 4, 5].map((i) => {
        const star = (
          <Star
            style={{ width: size, height: size }}
            strokeWidth={1.5}
            className={i <= shown ? 'fill-brand text-brand' : 'fill-transparent text-slate-300'}
          />
        );

        if (!interactive) {
          return (
            <span key={i} className="inline-flex">
              {star}
            </span>
          );
        }

        return (
          <button
            key={i}
            type="button"
            aria-label={`${i}`}
            onClick={() => onChange?.(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            className="inline-flex transition-transform duration-150 hover:scale-110"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
