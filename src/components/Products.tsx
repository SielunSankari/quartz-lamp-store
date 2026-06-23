'use client';

import type { Product } from '@/types/shop';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function Products({ products }: { products: Product[] }) {
  const t = useTranslations('Products');

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">{t('empty')}</p>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {products.map(product => (
        <article
          key={product.id}
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
        >
          <div className="mb-4">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>

          <div className="flex flex-col flex-grow">
            <h2 className="text-xl font-semibold mb-2 line-clamp-2 h-14 overflow-hidden">
              {product.name}
            </h2>

            <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
              {product.description}
            </p>

            <div className="flex justify-between items-center mt-auto">
              <p className="text-gray-900 font-bold text-xl mr-4">
                {product.price.toLocaleString('ru-RU')}
                {' '}
                ₸
              </p>

              <div className="flex gap-3">
                <Link href={`/products/${product.id}`}>
                  <Button variant="outline" className="h-10 px-4 py-2 text-base">
                    {t('open')}
                  </Button>
                </Link>
                <AddToCartButton product={product} iconOnly />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
