'use client';

import type { Review } from '@/libs/reviews';
import { StarRating } from '@/components/reviews/StarRating';
import { avatarColor } from '@/libs/avatarColor';
import { getMyReview, upsertReview } from '@/libs/reviews';
import { useAuth } from '@/providers/AuthProvider';
import { useCity } from '@/providers/CityProvider';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageSquareQuote } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoLocationOutline } from 'react-icons/io5';

// Мягкая тонированная подложка — отличается от белой панели, но спокойная.
const WRAP = 'mt-14 rounded-3xl border border-slate-200/60 bg-slate-50/70 p-8 text-center md:p-10';

// Форма отзыва. Один аккаунт = один отзыв (можно редактировать).
export function ReviewForm() {
  const t = useTranslations('Trust');
  const { user, loading } = useAuth();
  const { city } = useCity(); // город берём из профиля (привязан к аккаунту)
  const reduced = useReducedMotion();

  const [myReview, setMyReview] = useState<Review | null>(null);
  const [checked, setChecked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setMyReview(null);
      setChecked(true);
      return;
    }
    let active = true;
    getMyReview(user.uid)
      .then((r) => {
        if (!active) {
          return;
        }
        setMyReview(r);
        setChecked(true);
        if (r) {
          setRating(r.rating);
          setText(r.text);
        }
      })
      .catch(() => {
        if (active) {
          setChecked(true); // нет доступа — показываем форму как для нового отзыва
        }
      });
    return () => {
      active = false;
    };
  }, [user]);

  if (loading || (user && !checked)) {
    return null;
  }

  // Гость — приглашение войти.
  if (!user) {
    return (
      <div className={WRAP}>
        <p className="font-sans text-base text-slate-600">{t('login_to_review')}</p>
        <Link
          href="/sign-in/"
          className="mt-5 inline-flex rounded-full bg-slate-900 px-6 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          {t('login')}
        </Link>
      </div>
    );
  }

  // Отзыв уже есть и не редактируем — блок «Ваш отзыв».
  if (myReview && !editing) {
    return (
      <div className={WRAP}>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {t('your_review')}
        </p>

        {/* Речевая плашка с «хвостиком», выходящая из аватарки снизу-справа */}
        <div className="relative mx-auto mt-5 max-w-md">
          <div className="relative rounded-3xl border border-slate-200/70 bg-white p-5 text-left shadow-sm">
            <StarRating value={myReview.rating} size={16} />
            <p className="mt-3 font-sans text-base leading-relaxed text-slate-700">
              {myReview.text}
            </p>
            {/* хвостик пузыря (повёрнутый квадрат с нижне-правой границей) */}
            <div
              aria-hidden
              className="absolute -bottom-1.5 right-9 h-3.5 w-3.5 rotate-45 rounded-[3px] border-b border-r border-slate-200/70 bg-white"
            />
          </div>

          {/* Аватар снизу справа — из него «выходит» плашка */}
          <div className="mt-2.5 flex items-center justify-end gap-2 pr-1">
            <span className="font-sans text-xs font-medium text-slate-500">{myReview.userName}</span>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
              style={{ backgroundColor: myReview.userAvatarColor }}
            >
              {myReview.userName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-6 inline-flex rounded-full border border-slate-200 bg-white px-5 py-2 font-sans text-sm font-medium text-slate-800 shadow-sm transition-all hover:shadow-md"
        >
          {t('edit_review')}
        </button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || saving) {
      return;
    }
    setSaving(true);
    const userName = user.displayName || user.email?.split('@')[0] || 'Гость';
    const color = avatarColor(userName);
    try {
      await upsertReview(user.uid, { userName, userAvatarColor: color, rating, text, city });
      setMyReview({
        userId: user.uid,
        userName,
        userAvatarColor: color,
        rating,
        text: text.trim(),
        city: city.trim(),
        createdAt: myReview?.createdAt ?? Date.now(),
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mt-14 overflow-hidden rounded-3xl border border-slate-200/60 bg-slate-50/70 p-6 md:p-8"
    >
      <div className="grid items-stretch gap-8 md:grid-cols-[1fr_220px]">
        {/* СЛЕВО — пишем отзыв */}
        <div className="flex flex-col text-left">
          <p className="font-sans text-lg font-semibold text-slate-900">{t('leave_review')}</p>

          <StarRating value={rating} onChange={setRating} size={28} className="mt-4" />

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={600}
            rows={4}
            placeholder={t('review_placeholder')}
            className="mt-4 w-full flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 font-sans text-base text-slate-800 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
          />

          <div className="mt-4 flex items-center justify-between gap-3">
            {/* Город берётся из профиля (топ-бар), здесь только показываем */}
            <span className="inline-flex items-center gap-1.5 font-sans text-sm text-slate-500">
              <IoLocationOutline className="h-4 w-4 text-sky-600" />
              {city}
            </span>
            <button
              type="submit"
              disabled={saving || !text.trim()}
              className="inline-flex shrink-0 justify-center rounded-full bg-brand px-8 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 disabled:opacity-50"
            >
              {saving ? t('saving') : t('submit')}
            </button>
          </div>
        </div>

        {/* СПРАВА — крупная брендовая иконка + подпись */}
        <div className="relative hidden flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-sky-100 via-violet-100 to-white p-6 text-center md:flex">
          <motion.div
            animate={reduced ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MessageSquareQuote className="h-16 w-16 text-brand" strokeWidth={1.4} />
          </motion.div>
          <p className="font-sans text-sm leading-relaxed text-slate-500">
            {t('review_cta_note')}
          </p>
        </div>
      </div>
    </form>
  );
}
