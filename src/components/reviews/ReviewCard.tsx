'use client';

import type { Review } from '@/libs/reviews';
import { StarRating } from '@/components/reviews/StarRating';
import { motion } from 'framer-motion';
import { memo } from 'react';

// Карточка отзыва. memo — чтобы не перерисовывать при смене слайдов карусели.
export const ReviewCard = memo(({ review }: { review: Review }) => {
  return (
    <motion.figure
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="flex h-full w-[258px] max-w-[78vw] flex-col rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm sm:w-[300px] sm:p-6 md:w-[340px]"
    >
      <StarRating value={review.rating} size={15} />

      <blockquote className="mt-3 flex-1 font-sans text-sm leading-relaxed text-slate-700 sm:mt-4 sm:text-base">
        {review.text}
      </blockquote>

      <figcaption className="mt-4 flex items-center gap-2.5 sm:mt-5 sm:gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white sm:h-10 sm:w-10"
          style={{ backgroundColor: review.userAvatarColor }}
        >
          {review.userName.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-sans text-sm font-semibold text-slate-900">
            {review.userName}
          </span>
          {review.city && (
            <span className="block truncate font-sans text-xs text-slate-400">{review.city}</span>
          )}
        </span>
      </figcaption>
    </motion.figure>
  );
});

ReviewCard.displayName = 'ReviewCard';
