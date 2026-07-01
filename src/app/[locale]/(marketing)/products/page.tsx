import Products from '@/components/Products';
import { getProducts } from '@/libs/products';
import { buildAlternates } from '@/utils/Helpers';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type IProductsProps = {
  params: Promise<{ locale: string }>;
};

// ISR: каталог обновляется раз в час, а не читает Firestore на каждый запрос.
export const revalidate = 3600;

export async function generateMetadata({ params }: IProductsProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Products' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    alternates: buildAlternates('/products', locale),
  };
}

export default async function ProductsPage({ params }: IProductsProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getProducts();

  return <Products products={products} />;
}
