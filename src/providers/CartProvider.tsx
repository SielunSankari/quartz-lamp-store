'use client';

// Единый источник правды о корзине. Подписывается на документ carts/{uid}
// в Firestore и пересчитывает итоги. Никакого localStorage — корзина живёт в облаке
// и привязана к аккаунту (синхронизируется между устройствами).
import type { CartItem, Product } from '@/types/shop';
import {
  addToCart as addToCartDb,
  clearCart as clearCartDb,
  removeFromCart as removeFromCartDb,
  subscribeCart,
} from '@/libs/cart';
import { useAuth } from '@/providers/AuthProvider';
import { createContext, use, useEffect, useMemo, useState } from 'react';

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Живая подписка: любое изменение корзины в Firestore сразу обновит UI.
    const unsubscribe = subscribeCart(user.uid, (next) => {
      setItems(next);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return {
      items,
      totalItems,
      totalPrice,
      loading,
      addToCart: async (product) => {
        if (!user) {
          throw new Error('NOT_AUTHENTICATED');
        }
        await addToCartDb(user.uid, product);
      },
      removeFromCart: async (productId) => {
        if (!user) {
          return;
        }
        await removeFromCartDb(user.uid, productId);
      },
      clearCart: async () => {
        if (!user) {
          return;
        }
        await clearCartDb(user.uid);
      },
    };
  }, [items, loading, user]);

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const ctx = use(CartContext);
  if (!ctx) {
    throw new Error('useCart должен вызываться внутри <CartProvider>');
  }
  return ctx;
}
