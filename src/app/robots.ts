import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/utils/Helpers';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Личный кабинет и страницы входа/регистрации индексировать не нужно
      // (приватные и «тонкие» страницы — не для поиска).
      disallow: ['/api/', '/personal/', '/sign-in', '/sign-up', '/monitoring'],
    },
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
