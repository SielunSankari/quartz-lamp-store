// app/products/page.tsx
import Products from '@/components/Products';
import { getTranslations } from 'next-intl/server';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

type IProductsProps = {
  params: Promise<{ locale?: string }>; // Делаем params асинхронным
};

export async function generateMetadata({ params }: IProductsProps) {
  const resolvedParams = await params; // Ожидаем params
  const locale = resolvedParams?.locale || 'ru'; // Используем дефолтный язык, если locale отсутствует

  const t = await getTranslations({
    locale,
    namespace: 'Products', // Убедитесь, что есть соответствующий файл перевода
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch('http://localhost:3001/products', {
    next: { revalidate: 1 },
  });

  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.filter((p: any) => p.id && p.name && p.price > 0 && p.image_url);
}

export default async function ProductsPage({ params }: IProductsProps) {
  const resolvedParams = await params; // Ожидаем params
  const _locale = resolvedParams?.locale || 'ru'; // Используем значение по умолчанию, если locale отсутствует

  const products = await getProducts();
  // eslint-disable-next-line no-console
  console.log('Данные на странице:', products); // Проверьте вывод

  return <Products products={products} />;
}
