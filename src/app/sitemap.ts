import type { MetadataRoute } from 'next';
import { routing } from '@/libs/i18nNavigation';
import { getProducts } from '@/libs/products';
import { getBaseUrl, getI18nPath } from '@/utils/Helpers';

// Динамическая карта сайта: статические страницы + все товары, для каждой локали.
// Отдаётся с ISR (revalidate), чтобы новые товары попадали в индекс без пересборки.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const staticPaths = ['/', '/products', '/about', '/contacts'];

  let productPaths: string[] = [];
  try {
    const products = await getProducts();
    productPaths = products.map(p => `/products/${p.id}`);
  } catch {
    // Firestore недоступен на этапе генерации — отдаём хотя бы статические страницы.
    productPaths = [];
  }

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of [...staticPaths, ...productPaths]) {
      entries.push({
        url: `${baseUrl}${getI18nPath(path, locale)}`,
        lastModified: now,
        changeFrequency: path === '/' ? 'daily' : 'weekly',
        priority: path === '/' ? 1 : path.startsWith('/products/') ? 0.8 : 0.6,
      });
    }
  }

  return entries;
}
