'use client';

import type { Product } from '@/types/shop';
import { AddToCartButton } from '@/components/AddToCartButton';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function Products({ products }: { products: Product[] }) {
  const t = useTranslations('Products');

  if (products.length === 0) {
    return <p className="py-12 text-center text-slate-500">{t('empty')}</p>;
  }

  return (
    // Full-bleed: гасим большой боковой отступ <main>, чтобы поместилось 4 в ряд
    <div className="-mx-4 sm:-mx-6 md:-mx-12 lg:-mx-24 xl:-mx-36 2xl:-mx-48">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:gap-6">
          {products.map(product => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/60 shadow-[0_8px_28px_-16px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.25)]"
            >
              {/* Фото — белый фон, одинаковая высота, не обрезается */}
              <Link href={`/products/${product.id}`} className="relative block h-40 w-full bg-white sm:h-52">
                <Image
                  data-fly-image
                  src={product.imageUrl}
                  alt={product.alt ?? product.name}
                  fill
                  className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:p-6"
                  sizes="(max-width: 640px) 50vw, 280px"
                />
              </Link>

              {/* Тело */}
              <div className="flex flex-1 flex-col p-3 sm:p-5">
                <Link href={`/products/${product.id}`}>
                  <h2 className="line-clamp-2 font-sans text-sm font-semibold leading-snug tracking-tight text-slate-900 sm:text-[15px]">
                    {product.name}
                  </h2>
                </Link>
                <p className="mt-1.5 line-clamp-2 font-sans text-sm leading-relaxed text-slate-500">
                  {product.description}
                </p>

                <p className="mt-3 font-sans text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {product.price.toLocaleString('ru-RU')}
                  {' '}
                  ₸
                </p>

                {/* Действия */}
                <div className="mt-3 flex flex-col gap-2 sm:mt-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex items-center justify-center rounded-full border border-slate-200/80 bg-white/50 px-3 py-2 font-sans text-[13px] font-medium text-slate-700 backdrop-blur-md transition-all duration-200 hover:bg-white hover:shadow-sm"
                    >
                      {t('details')}
                    </Link>
                    {product.kaspiUrl
                      ? (
                          <a
                            href={product.kaspiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center rounded-full bg-[#F14635] px-3 py-2 font-sans text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#d83a2c] hover:shadow-sm"
                          >
                            {t('kaspi')}
                          </a>
                        )
                      : null}
                  </div>

                  <AddToCartButton
                    product={product}
                    className="h-11 w-full rounded-full bg-sky-600 font-sans text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-sky-700 hover:shadow-md"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
