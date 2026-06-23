'use client';

import type { Product } from '@/types/shop';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
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
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (!user) {
      router.push('/sign-in/');
      return;
    }
    setPending(true);
    try {
      await addToCart(product);
    } finally {
      setPending(false);
    }
  };

  if (iconOnly) {
    return (
      <Button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label={t('add_to_cart')}
        className={className ?? 'h-10 w-10 p-0 flex items-center justify-center'}
      >
        <ShoppingCartIcon className="h-5 w-5 text-white" />
      </Button>
    );
  }

  return (
    <Button type="button" onClick={handleClick} disabled={pending} className={className}>
      <ShoppingCartIcon className="h-5 w-5 mr-2" />
      {t('add_to_cart')}
    </Button>
  );
};
