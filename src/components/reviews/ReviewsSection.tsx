'use client';

import type { Review } from '@/libs/reviews';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { subscribeReviews } from '@/libs/reviews';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// Секция отзывов: живая карусель (Swiper) из Firestore + форма под ней.
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
            <Swiper
              modules={[Autoplay]}
              loop={reviews.length > 3}
              autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              speed={700}
              spaceBetween={24}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="mt-8 px-1 py-2 [&_.swiper-slide]:h-auto [&_.swiper-wrapper]:items-stretch"
            >
              {reviews.map(r => (
                <SwiperSlide key={r.userId} className="h-auto">
                  <ReviewCard review={r} />
                </SwiperSlide>
              ))}
            </Swiper>
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
