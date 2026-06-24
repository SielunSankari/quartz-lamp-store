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
      className="flex h-full flex-col rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm"
    >
      <StarRating value={review.rating} size={16} />

      <blockquote className="mt-4 flex-1 font-sans text-base leading-relaxed text-slate-700">
        {review.text}
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
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
