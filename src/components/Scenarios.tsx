'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type SceneKey = 'home' | 'office' | 'cafe' | 'clinic';

const SCENES: { key: SceneKey; img: string }[] = [
  { key: 'home', img: '/assets/images/scene-home.png' },
  { key: 'office', img: '/assets/images/scene-office.png' },
  { key: 'cafe', img: '/assets/images/scene-cafe.png' },
  // TODO: заменить на реальное фото клиники (пока — временно фото офиса).
  { key: 'clinic', img: '/assets/images/scene-clinic.png' },
];

const AUTOPLAY_MS = 6000;

export default function Scenarios() {
  const t = useTranslations('Scenarios');
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Автопрокрутка каждые 6с; таймер сбрасывается при любой смене и на паузе.
  useEffect(() => {
    if (paused) {
      return;
    }
    const id = setTimeout(() => setActive(a => (a + 1) % SCENES.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused]);

  const activeKey = SCENES[active]!.key;

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative left-1/2 h-[92vh] min-h-[600px] w-screen -translate-x-1/2 overflow-hidden"
    >
      {/* Фоновые изображения — кроссфейд по opacity (все предзагружены) */}
      {SCENES.map((s, i) => (
        <motion.div
          key={s.key}
          aria-hidden
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === active ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.8, ease: 'easeInOut' }}
        >
          <Image
            src={s.img}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      ))}

      {/* Затемнение для читаемости текста */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

      {/* Контент */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-between gap-8 px-6 md:px-12">
        {/* ЛЕВО — большой заголовок + живой подзаголовок (меняются с fade) */}
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKey}
              initial={{ opacity: 0, y: reduced ? 0 : 24, filter: reduced ? 'none' : 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: reduced ? 0 : -24, filter: reduced ? 'none' : 'blur(10px)' }}
              transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2
                className="font-sans font-extrabold leading-[1.03] tracking-tight text-white drop-shadow-sm"
                style={{ fontSize: 'clamp(34px, 4.6vw, 60px)' }}
              >
                {t(`${activeKey}.title`)}
              </h2>
              <p className="mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-white/85 md:text-lg">
                {t(`${activeKey}.subtitle`)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ПРАВО — вертикальный стеклянный переключатель (десктоп) */}
        <div
          className="hidden shrink-0 flex-col gap-1 rounded-[1.75rem] p-2 md:flex"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          {SCENES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActive(i)}
                className="relative flex items-center gap-3 rounded-3xl px-6 py-4 text-left outline-none"
              >
                {isActive && (
                  <motion.span
                    layoutId="sceneActivePill"
                    className="absolute inset-0 rounded-3xl bg-white/95"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 font-sans font-semibold transition-all duration-300 ${
                    isActive ? 'text-lg text-slate-900' : 'text-base text-white/85'
                  }`}
                >
                  {t(`${s.key}.label`)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Мобильный переключатель — горизонтальный, внизу */}
      <div
        className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-full p-1.5 md:hidden"
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        {SCENES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              i === active ? 'bg-white/95 text-slate-900' : 'text-white/85'
            }`}
          >
            {t(`${s.key}.label`)}
          </button>
        ))}
      </div>

      {/* Индикаторы слайдов снизу по центру */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SCENES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActive(i)}
            aria-label={t(`${s.key}.label`)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === active ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
