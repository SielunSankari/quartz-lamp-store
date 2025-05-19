import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'BAIMED',
  locales: ['kz', 'ru'],
  defaultLocale: 'ru',
  localePrefix,
};
