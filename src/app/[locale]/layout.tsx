import type { Metadata } from 'next';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { AuthWrapper } from '@/components/AuthWrapper';
import { RightNav } from '@/components/RightNav';
import { routing } from '@/libs/i18nNavigation';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '@/styles/global.css';

export const metadata: Metadata = {
  icons: [
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'icon', url: '/favicon.ico' },
  ],
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export const ClientOnlyNav = () => {
  return <RightNav />;
};

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
    <html lang={locale}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PostHogProvider>
            <AuthWrapper />
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
              rightNav={<ClientOnlyNav />}
            >
              <div className="py-5 text-xl [&_p]:my-6">{props.children}</div>
            </BaseTemplate>
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
