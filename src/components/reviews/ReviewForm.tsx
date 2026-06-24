'use client';

import type { Review } from '@/libs/reviews';
import { StarRating } from '@/components/reviews/StarRating';
import { avatarColor } from '@/libs/avatarColor';
import { getMyReview, upsertReview } from '@/libs/reviews';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Форма отзыва. Один аккаунт = один отзыв (можно редактировать).
export function ReviewForm() {
  const t = useTranslations('Trust');
  const { user, loading } = useAuth();

  const [myReview, setMyReview] = useState<Review | null>(null);
  const [checked, setChecked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setMyReview(null);
      setChecked(true);
      return;
    }
    let active = true;
    getMyReview(user.uid).then((r) => {
      if (!active) {
        return;
      }
      setMyReview(r);
      setChecked(true);
      if (r) {
        setRating(r.rating);
        setText(r.text);
        setCity(r.city);
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
      <div className="mt-12 rounded-3xl border border-slate-200/70 bg-white p-8 text-center">
        <p className="font-sans text-base text-slate-600">{t('login_to_review')}</p>
        <Link
          href="/sign-in/"
          className="mt-4 inline-flex rounded-full bg-slate-900 px-6 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          {t('login')}
        </Link>
      </div>
    );
  }

  // Отзыв уже есть и не редактируем — блок «Ваш отзыв».
  if (myReview && !editing) {
    return (
      <div className="mt-12 rounded-3xl border border-slate-200/70 bg-white p-8">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {t('your_review')}
        </p>
        <StarRating value={myReview.rating} size={18} className="mt-3" />
        <p className="mt-3 font-sans text-base leading-relaxed text-slate-700">{myReview.text}</p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-5 inline-flex rounded-full border border-slate-200 bg-white px-5 py-2 font-sans text-sm font-medium text-slate-800 shadow-sm transition-all hover:shadow-md"
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

  const fieldClass
    = 'w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 font-sans text-slate-800 outline-none transition focus:border-brand/40 focus:bg-white focus:ring-2 focus:ring-brand/20';

  return (
    <form onSubmit={submit} className="mt-12 rounded-3xl border border-slate-200/70 bg-white p-8">
      <p className="font-sans text-base font-semibold text-slate-900">{t('leave_review')}</p>

      <StarRating value={rating} onChange={setRating} size={26} className="mt-4" />

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={600}
        rows={4}
        placeholder={t('review_placeholder')}
        className={`${fieldClass} mt-4 resize-none py-3 text-base`}
      />
      <input
        value={city}
        onChange={e => setCity(e.target.value)}
        maxLength={60}
        placeholder={t('city_placeholder')}
        className={`${fieldClass} mt-3 py-2.5 text-sm`}
      />

      <button
        type="submit"
        disabled={saving || !text.trim()}
        className="mt-5 inline-flex rounded-full bg-brand px-7 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 disabled:opacity-50"
      >
        {saving ? t('saving') : t('submit')}
      </button>
    </form>
  );
}
