import { Button } from '@/components/ui/button';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { notFound } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

async function getProduct(id: number): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:3001/products/${id}`, {
      cache: 'no-store',
      next: { tags: [`product-${id}`] }, // Для revalidation если нужно
    });

    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(Number(params.id));
  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Изображение продукта */}
        <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Информация о продукте */}
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
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">
                {Number(product.price).toLocaleString('ru-RU', {
                  style: 'decimal',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                {' '}
                ₸
              </p>
            </div>

            <div className="mt-6">
              <Button className="w-full md:w-auto">
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Добавить в корзину
              </Button>
            </div>
          </div>

          {/* Дополнительные детали */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            {/* <h2 className="text-lg font-medium text-gray-900">Характеристики</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-4">
                <span className="text-gray-600">Мощность:</span>
                <span className="font-medium">18W</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-600">Длина:</span>
                <span className="font-medium">60 см</span>
              </li>
            </ul> */}
          </div>
        </div>
      </div>
    </div>
  );
}
