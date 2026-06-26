// Координация анимации «товар летит в корзину» (zustand — глобально, без провайдера).
// AddToCartButton вызывает launch(), CartFlyLayer проигрывает полёт к профиль-чипу
// (id="cart-fly-target"), который делает «pop» по landSignal после посадки.
import { create } from 'zustand';

export type Flight = {
  id: number;
  imageUrl: string;
  from: { x: number; y: number; size: number };
  to: { x: number; y: number };
};

type CartFxState = {
  flights: Flight[];
  landSignal: number; // ++ при каждой завершённой посадке
  launch: (imageUrl: string, fromRect: DOMRect) => void;
  complete: (id: number) => void;
};

export const useCartFx = create<CartFxState>(set => ({
  flights: [],
  landSignal: 0,
  launch: (imageUrl, fromRect) => {
    if (typeof document === 'undefined') {
      return;
    }
    const target = document.getElementById('cart-fly-target');
    if (!target) {
      return;
    }
    const t = target.getBoundingClientRect();
    const size = Math.min(Math.min(fromRect.width, fromRect.height), 180);
    set(s => ({
      flights: [
        ...s.flights,
        {
          id: Date.now() + Math.random(),
          imageUrl,
          from: {
            x: fromRect.left + fromRect.width / 2,
            y: fromRect.top + fromRect.height / 2,
            size,
          },
          to: { x: t.left + t.width / 2, y: t.top + t.height / 2 },
        },
      ],
    }));
  },
  complete: id =>
    set(s => ({
      flights: s.flights.filter(f => f.id !== id),
      landSignal: s.landSignal + 1,
    })),
}));
