import Products from '@/components/Products';
import { getProducts } from '@/libs/products';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type IProductsProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: IProductsProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Products' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function ProductsPage({ params }: IProductsProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getProducts();

  return <Products products={products} />;
}
