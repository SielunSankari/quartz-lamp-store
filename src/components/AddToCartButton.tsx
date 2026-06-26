'use client';

import type { Product } from '@/types/shop';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { useCartFx } from '@/stores/cartFx';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  product: Product;
  className?: string;
  iconOnly?: boolean; // компактный режим (только иконка) для карточек каталога
};

// Единая кнопка «в корзину». Если гость не вошёл — мягко уводим на вход.
export const AddToCartButton = ({ product, className, iconOnly }: Props) => {
  const t = useTranslations('Products');
  const { user } = useAuth();
  const { addToCart } = useCart();
  const launch = useCartFx(s => s.launch);
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
    if (!user) {
      router.push('/sign-up/');
      return;
    }
    // Старт полёта — именно от ФОТО товара (в карточке каталога или в галерее).
    const btn = e.currentTarget;
    const imgEl
      = btn.closest('article')?.querySelector('[data-fly-image]')
        ?? document.querySelector('[data-fly-image]');
    const fromRect = (imgEl ?? btn).getBoundingClientRect();
    launch(product.imageUrl, fromRect);

    setPending(true);
    try {
      await addToCart(product);
    } finally {
      setPending(false);
    }
  };

  if (iconOnly) {
    // Лёгкая стеклянная круглая кнопка (Apple-стиль) для карточек каталога.
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label={t('add_to_cart')}
        className={
          className
          ?? 'flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/70 text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white hover:text-slate-900 hover:shadow-md disabled:opacity-50'
        }
      >
        <ShoppingCartIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <Button type="button" onClick={handleClick} disabled={pending} className={className}>
      <ShoppingCartIcon className="h-5 w-5 mr-2" />
      {t('add_to_cart')}
    </Button>
  );
};
