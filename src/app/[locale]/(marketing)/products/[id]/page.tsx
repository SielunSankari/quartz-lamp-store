import { AddToCartButton } from '@/components/AddToCartButton';
import { getProduct } from '@/libs/products';
import Image from 'next/image';
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {product.description}
            </p>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-3xl font-bold text-gray-900">
              {product.price.toLocaleString('ru-RU')}
              {' '}
              ₸
            </p>

            <div className="mt-6">
              <AddToCartButton product={product} className="w-full md:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
