import { routing } from '@/libs/i18nNavigation';

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (
    process.env.VERCEL_ENV === 'production'
    && process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // В проде URL обязателен: иначе robots/sitemap/OG/редиректы Stripe укажут на
  // localhost. Падаем громко при деплое, а не тихо отдаём неверный адрес.
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Не задан базовый URL сайта: укажите NEXT_PUBLIC_APP_URL (или используйте деплой на Vercel).',
    );
  }

  return 'http://localhost:3000';
};

export const getI18nPath = (url: string, locale: string) => {
  if (locale === routing.defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
};

// Локализованный путь без хвостового слэша (кроме корня '/').
function localizedPath(basePath: string, locale: string) {
  const path = getI18nPath(basePath, locale);
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

// Строит `alternates` для metadata конкретной страницы:
//  • canonical — ссылка на саму себя в текущей локали (самоканоникал);
//  • languages — hreflang на все локали + x-default (локаль по умолчанию).
// Пути относительные — резолвятся против metadataBase (задан в корневом layout).
// basePath — путь страницы БЕЗ префикса локали, например '/products/lamp-1'.
export function buildAlternates(basePath: string, locale: string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = localizedPath(basePath, l);
  }
  languages['x-default'] = localizedPath(basePath, routing.defaultLocale);

  return {
    canonical: localizedPath(basePath, locale),
    languages,
  };
}
