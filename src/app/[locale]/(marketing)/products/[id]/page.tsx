import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductGallery } from '@/components/ProductGallery';
import { getProduct } from '@/libs/products';
import { Check, MapPin, ShieldAlert } from 'lucide-react';
import { notFound } from 'next/navigation';

type ProductPageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: 'Not found' };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const images = product.images?.length ? product.images : [product.imageUrl];
  const details = product.details;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
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
            <div className="mt-6">
              <AddToCartButton product={product} className="w-full md:w-auto" />
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
            <section className="mt-16">
              <h2 className="font-sans text-xl font-semibold text-slate-900 md:text-2xl">Где используется</h2>
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
            <section className="mt-16">
              <h2 className="font-sans text-xl font-semibold text-slate-900 md:text-2xl">Технические характеристики</h2>
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
            <section className="mt-16">
              <h2 className="flex items-center gap-2.5 font-sans text-xl font-semibold text-slate-900 md:text-2xl">
                <ShieldAlert className="h-6 w-6 text-amber-500" strokeWidth={1.8} />
                Рекомендации по безопасности
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
