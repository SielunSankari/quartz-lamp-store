'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Сертификат как «бумажка» (принцип Apple — прямое манипулирование):
// при наведении приподнимается, по клику вырастает с её же места в крупный
// вид с пружинной физикой (общий layoutId), Esc / клик по фону — ложится обратно.
const SPRING = { type: 'spring', stiffness: 260, damping: 26 } as const;

export function CertificateViewer({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const layoutId = `certificate-${src}`; // уникальный на каждый документ

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt}
        className="block shrink-0 cursor-zoom-in rounded-xl transition-all duration-300 hover:-translate-y-1 hover:rotate-[-0.6deg] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <motion.img
          layoutId={layoutId}
          src={src}
          alt={alt}
          transition={SPRING}
          className="h-44 w-auto rounded-xl border border-slate-200 bg-white object-contain shadow-sm transition-shadow duration-300 hover:shadow-xl"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.img
              layoutId={layoutId}
              src={src}
              alt={alt}
              transition={SPRING}
              onClick={e => e.stopPropagation()}
              className="max-h-[90vh] max-w-[92vw] cursor-zoom-out rounded-2xl bg-white shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
