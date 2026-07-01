import { AddToCartButton } from '@/components/AddToCartButton';
import { JsonLd } from '@/components/JsonLd';
import { MarketButton } from '@/components/MarketButton';
import { ProductGallery } from '@/components/ProductGallery';
import { routing } from '@/libs/i18nNavigation';
import { getProduct, getProducts } from '@/libs/products';
import { buildAlternates, getBaseUrl, getI18nPath } from '@/utils/Helpers';
import { Check, MapPin, ShieldAlert } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

type ProductPageProps = {
  params: Promise<{ id: string; locale: string }>;
};

// ISR: страница товара статически пре-рендерится и обновляется раз в час,
// вместо запроса к Firestore на каждый заход. Держит TTFB низким под нагрузкой.
export const revalidate = 3600;

// Пре-рендер известных товаров на этапе сборки (для каждой локали).
// Если Firestore недоступен во время сборки — не валим билд: страницы отрендерятся
// по запросу и закэшируются (dynamicParams по умолчанию включён).
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return routing.locales.flatMap(locale =>
      products.map(product => ({ locale, id: product.id })),
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id, locale } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: 'Not found' };
  }

  return {
    title: product.name,
    description: product.description,
    alternates: buildAlternates(`/products/${id}`, locale),
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Product' });
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const images = product.images?.length ? product.images : [product.imageUrl];
  const details = product.details;

  // Structured data (schema.org) — карточка товара и «хлебные крошки» для Google.
  const baseUrl = getBaseUrl();
  const productUrl = `${baseUrl}${getI18nPath(`/products/${product.id}`, locale)}`;
  const absImages = images
    .filter(Boolean)
    .map(src => (src.startsWith('http') ? src : `${baseUrl}${src}`));

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'description': details?.summary || product.description,
    ...(absImages.length ? { image: absImages } : {}),
    'brand': { '@type': 'Brand', 'name': 'BAIMED' },
    'offers': {
      '@type': 'Offer',
      'url': productUrl,
      'priceCurrency': 'KZT',
      'price': product.price,
      'availability': 'https://schema.org/InStock',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'BAIMED', 'item': `${baseUrl}${getI18nPath('/', locale)}` },
      { '@type': 'ListItem', 'position': 2, 'name': t('catalog'), 'item': `${baseUrl}${getI18nPath('/products', locale)}` },
      { '@type': 'ListItem', 'position': 3, 'name': product.name, 'item': productUrl },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      {/* Верх: галерея + покупка */}
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={images} alt={product.alt ?? product.name} />

        <div className="flex flex-col">
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-5 font-sans text-lg leading-relaxed text-slate-600">
            {details?.summary ?? product.description}
          </p>

          <div className="mt-7 border-t border-slate-200 pt-7">
            <p className="font-sans text-3xl font-bold text-slate-900">
              {product.price.toLocaleString('ru-RU')}
              {' '}
              ₸
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <AddToCartButton
                product={product}
                className="h-12 rounded-full bg-gradient-to-r from-sky-600 to-violet-500 px-8 font-sans text-base font-medium text-white shadow-sm transition-all hover:from-sky-700 hover:to-violet-600 hover:shadow-md"
              />
              {/* Маркетплейсы: цветная кнопка при наличии ссылки, иначе «заблокировано». */}
              <div className="grid grid-cols-2 gap-3">
                <MarketButton
                  url={product.kaspiUrl}
                  label={t('kaspi')}
                  unavailableLabel={t('unavailable')}
                  activeClass="bg-[#F14635] hover:bg-[#d83a2c]"
                  className="h-12 px-4 text-base"
                />
                <MarketButton
                  url={product.halykUrl}
                  label={t('halyk')}
                  unavailableLabel={t('unavailable')}
                  activeClass="bg-[#00A651] hover:bg-[#008f46]"
                  className="h-12 px-4 text-base"
                />
              </div>
            </div>
          </div>

          {details?.advantages?.length
            ? (
                <ul className="mt-8 space-y-3">
                  {details.advantages.map(a => (
                    <li key={a} className="flex items-start gap-3 font-sans text-base text-slate-700">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" strokeWidth={2.2} />
                      {a}
                    </li>
                  ))}
                </ul>
              )
            : null}
        </div>
      </div>

      {/* Где используется */}
      {details?.usage?.length
        ? (
            <section className="mt-10 sm:mt-16">
              <h2 className="font-sans text-xl font-semibold text-slate-900 md:text-2xl">{t('usage_title')}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {details.usage.map(u => (
                  <div key={u} className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-5 font-sans text-base text-slate-700">
                    <MapPin className="h-5 w-5 shrink-0 text-sky-500" strokeWidth={1.8} />
                    {u}
                  </div>
                ))}
              </div>
            </section>
          )
        : null}

      {/* Технические характеристики */}
      {product.specs?.length
        ? (
            <section className="mt-10 sm:mt-16">
              <h2 className="font-sans text-xl font-semibold text-slate-900 md:text-2xl">{t('specs_title')}</h2>
              <dl className="mt-5 overflow-hidden rounded-2xl border border-slate-200/70">
                {product.specs.map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex justify-between gap-4 px-5 py-4 font-sans text-base ${i % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}`}
                  >
                    <dt className="text-slate-500">{s.label}</dt>
                    <dd className="text-right font-medium text-slate-900">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )
        : null}

      {/* Рекомендации по безопасности */}
      {details?.safety?.length
        ? (
            <section className="mt-10 sm:mt-16">
              <h2 className="flex items-center gap-2.5 font-sans text-xl font-semibold text-slate-900 md:text-2xl">
                <ShieldAlert className="h-6 w-6 text-amber-500" strokeWidth={1.8} />
                {t('safety_title')}
              </h2>
              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {details.safety.map((s, i) => (
                  <li key={s} className="flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 font-sans text-base font-bold text-amber-600">
                      {i + 1}
                    </span>
                    <span className="font-sans text-base leading-relaxed text-slate-700">{s}</span>
                  </li>
                ))}
              </ol>
            </section>
          )
        : null}
    </div>
  );
}
