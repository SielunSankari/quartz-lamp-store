import { AppConfig } from '@/utils/AppConfig';
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
  // Без cookie/Accept-Language авто-детекта: URL без префикса = язык по умолчанию (ru).
  // Иначе при localePrefix='as-needed' переключение kz → ru «отскакивает» обратно на /kz,
  // потому что старый cookie NEXT_LOCALE=kz заставляет middleware редиректить назад.
  localeDetection: false,
});

export const { usePathname, useRouter } = createNavigation(routing);
