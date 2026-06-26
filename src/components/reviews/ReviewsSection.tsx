'use client';

import type { Review } from '@/libs/reviews';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { subscribeReviews } from '@/libs/reviews';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';

// Секция отзывов: бесконечная авто-лента, которую можно листать самому
// (перетаскивание мышью / свайп / стрелки). На время взаимодействия авто-прокрутка
// замирает, затем сама продолжается. Бесшовный цикл — без рывков.
export function ReviewsSection() {
  const t = useTranslations('Trust');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);

  const scroller = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const fracRef = useRef(0); // копим дробные пиксели (scrollLeft хранит целые)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });

  useEffect(() => {
    const unsub = subscribeReviews((r) => {
      setReviews(r);
      setLoaded(true);
    });
    return unsub;
  }, []);

  // Сколько раз продублировать список, чтобы хватило на бесшовный цикл.
  const copies = reviews.length === 0
    ? 1
    : reviews.length >= 6
      ? 2
      : Math.max(2, Math.ceil(12 / reviews.length));

  const display = useMemo(
    () => Array.from({ length: copies }).flatMap(() => reviews),
    [reviews, copies],
  );

  const pause = () => {
    pausedRef.current = true;
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  };
  const scheduleResume = () => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
    }
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, 700);
  };

  // Авто-прокрутка через requestAnimationFrame + бесшовный возврат.
  useEffect(() => {
    const el = scroller.current;
    if (!el || reviews.length === 0) {
      return undefined;
    }
    let raf = 0;
    const speed = 0.6; // px за кадр
    const tick = () => {
      const oneCopy = el.scrollWidth / copies;
      if (!pausedRef.current) {
        fracRef.current += speed;
        const whole = Math.floor(fracRef.current);
        if (whole >= 1) {
          el.scrollLeft += whole;
          fracRef.current -= whole;
        }
      }
      // бесшовно заворачиваем в обе стороны (контент идентичен)
      if (oneCopy > 0) {
        if (el.scrollLeft >= oneCopy) {
          el.scrollLeft -= oneCopy;
        } else if (el.scrollLeft < 0) {
          el.scrollLeft += oneCopy;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reviews, copies]);

  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) {
      return;
    }
    const card = el.querySelector('[data-review-card]');
    const w = card ? card.getBoundingClientRect().width + 16 : 320;
    pause();
    el.scrollBy({ left: dir * w, behavior: 'smooth' });
    scheduleResume();
  };

  // Перетаскивание мышью (на тач — нативный свайп).
  const onPointerDown = (e: React.PointerEvent) => {
    pause();
    const el = scroller.current;
    if (el && e.pointerType === 'mouse') {
      drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft };
      el.setPointerCapture(e.pointerId);
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = scroller.current;
    if (el && drag.current.active) {
      el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
    }
  };
  const endDrag = () => {
    drag.current.active = false;
    scheduleResume();
  };

  return (
    <div className="mt-20">
      <h3 className="text-center font-sans text-xl font-semibold text-slate-900 md:text-2xl">
        {t('reviews_title')}
      </h3>

      {reviews.length > 0
        ? (
            <div className="relative mt-8">
              <button
                type="button"
                aria-label="Назад"
                onClick={() => step(-1)}
                className="absolute left-1 top-[42%] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/70 bg-white/80 text-slate-600 shadow-sm backdrop-blur transition-all hover:bg-white hover:text-slate-900 hover:shadow-md md:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Вперёд"
                onClick={() => step(1)}
                className="absolute right-1 top-[42%] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/70 bg-white/80 text-slate-600 shadow-sm backdrop-blur transition-all hover:bg-white hover:text-slate-900 hover:shadow-md md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div
                ref={scroller}
                onPointerEnter={pause}
                onPointerLeave={() => {
                  endDrag();
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                className="flex cursor-grab gap-4 overflow-x-auto px-1 pb-3 select-none active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {display.map((r, i) => (
                  <div key={`${r.userId}-${i}`} data-review-card className="shrink-0">
                    <ReviewCard review={r} />
                  </div>
                ))}
              </div>

              <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent md:w-20" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent md:w-20" />
            </div>
          )
        : loaded
          ? (
              <p className="mt-8 text-center font-sans text-base text-slate-400">{t('no_reviews')}</p>
            )
          : null}

      <ReviewForm />
    </div>
  );
}
