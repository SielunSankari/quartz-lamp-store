'use client';

import type { Review } from '@/libs/reviews';
import { Marquee } from '@/components/magicui/marquee';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { subscribeReviews } from '@/libs/reviews';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

// Секция отзывов: бесконечная лента (Magic UI Marquee) из Firestore + форма.
export function ReviewsSection() {
  const t = useTranslations('Trust');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsub = subscribeReviews((r) => {
      setReviews(r);
      setLoaded(true);
    });
    return unsub;
  }, []);

  return (
    <div className="mt-20">
      <h3 className="text-center font-sans text-xl font-semibold text-slate-900 md:text-2xl">
        {t('reviews_title')}
      </h3>

      {reviews.length > 0
        ? (
            <div className="relative mt-8">
              <Marquee pauseOnHover duration="80s">
                {reviews.map(r => (
                  <ReviewCard key={r.userId} review={r} />
                ))}
              </Marquee>
              {/* Мягкое затухание по краям — в цвет панели */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent md:w-24" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent md:w-24" />
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
