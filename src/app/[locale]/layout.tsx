import type { Metadata } from 'next';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { RightNav } from '@/components/RightNav';
import { routing } from '@/libs/i18nNavigation';
import { AuthProvider } from '@/providers/AuthProvider';
import { CartProvider } from '@/providers/CartProvider';
import { CityProvider } from '@/providers/CityProvider';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '@/styles/global.css';

// Единственный шрифт — чистейший нео-гротеск «Купертино» (Inter / SF Pro).
// Никаких засечек. С полной кириллицей.
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Index' });

  // ВАЖНО: canonical здесь НЕ задаём. Корневой layout применяется ко всем
  // страницам, и любой canonical отсюда унаследовался бы всеми подстраницами
  // (каталог/товары указывали бы на главную). Самоканоникал + hreflang каждая
  // страница задаёт сама через buildAlternates() в своём generateMetadata.
  return {
    metadataBase: new URL(getBaseUrl()),
    title: {
      default: t('meta_title'),
      template: `%s - ${AppConfig.name}`,
    },
    description: t('meta_description'),
    applicationName: AppConfig.name,
    manifest: '/manifest.webmanifest',
    openGraph: {
      type: 'website',
      siteName: AppConfig.name,
      locale: locale === 'kz' ? 'kk_KZ' : 'ru_RU',
      title: t('meta_title'),
      description: t('meta_description'),
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: AppConfig.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
      images: ['/og-image.png'],
    },
    icons: [
      { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
      { rel: 'icon', url: '/favicon.ico' },
    ],
  };
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'RootLayout' });

  return (
    <html lang={locale} className={inter.variable}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PostHogProvider>
            <AuthProvider>
              <CityProvider>
                <CartProvider>
                  <BaseTemplate
                    leftNav={(
                      <>
                        <li>
                          <Link
                            href="/"
                            className="border-none text-gray-700 hover:text-gray-900"
                          >
                            {t('home_link')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/products/"
                            className="border-none text-gray-700 hover:text-gray-900"
                          >
                            {t('catalog_link')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/contacts/"
                            className="border-none text-gray-700 hover:text-gray-900"
                          >
                            {t('contacts_link')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/about/"
                            className="border-none text-gray-700 hover:text-gray-900"
                          >
                            {t('about_link')}
                          </Link>
                        </li>
                      </>
                    )}
                    rightNav={<RightNav />}
                  >
                    <div className="py-5 text-xl [&_p]:my-6">{props.children}</div>
                  </BaseTemplate>
                </CartProvider>
              </CityProvider>
            </AuthProvider>
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
