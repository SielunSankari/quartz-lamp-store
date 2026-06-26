'use client';

import { useCartFx } from '@/stores/cartFx';
import { motion } from 'framer-motion';

// Слой полётов (рендерится один раз). Каждый «рейс» — фото товара, летящее
// по дуге (Безье через keyframes) к иконке корзины: уменьшается, поворачивается,
// ease-in-out (разгон → торможение), сохраняет тень. Framer Motion = rAF + 60 FPS.
export function CartFlyLayer() {
  const flights = useCartFx(s => s.flights);
  const complete = useCartFx(s => s.complete);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {flights.map((f) => {
        const half = f.from.size / 2;
        const startX = f.from.x - half;
        const endX = f.to.x - half;
        const midX = (startX + endX) / 2;
        const startY = f.from.y - half;
        const endY = f.to.y - half;
        // вершина дуги — слегка приподнята над линейной серединой (пологая дуга, не «свечка»)
        const lift = Math.min(70, Math.hypot(endX - startX, endY - startY) * 0.12);
        const apexY = Math.max(12, (startY + endY) / 2 - lift);

        return (
          <motion.img
            key={f.id}
            src={f.imageUrl}
            alt=""
            initial={{ x: startX, y: startY, scale: 1, rotate: 0, opacity: 1 }}
            animate={{
              x: [startX, midX, endX],
              y: [startY, apexY, endY],
              scale: [1, 0.5, 0.16],
              rotate: [0, 9, 18],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.75, ease: 'easeInOut', times: [0, 0.5, 1] }}
            onAnimationComplete={() => complete(f.id)}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: f.from.size,
              height: f.from.size,
              objectFit: 'contain',
              borderRadius: 18,
              background: '#fff',
              padding: 8,
              boxShadow: '0 18px 42px -12px rgba(15,23,42,0.45)',
              willChange: 'transform, opacity',
            }}
          />
        );
      })}
    </div>
  );
}
