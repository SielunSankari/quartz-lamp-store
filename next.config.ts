import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/libs/Env';

const withNextIntl = createNextIntlPlugin('./src/libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV === 'development';

// Content-Security-Policy — перечень источников, которым разрешено грузиться.
// 'unsafe-eval' нужен только dev-режиму (HMR / react-refresh), в проде его нет.
// Разрешены реально используемые сервисы: Firebase, Stripe, PostHog, Sentry,
// плитки карты Leaflet (CARTO/OSM), Google-аватары и reCAPTCHA (телефонный вход).
const cspHeader = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? ` 'unsafe-eval'` : ''} https://js.stripe.com https://*.posthog.com https://www.google.com https://www.gstatic.com https://apis.google.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://i.ibb.co https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org`,
  `font-src 'self' data:`,
  `connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.posthog.com https://api.stripe.com https://*.ingest.sentry.io https://*.ingest.de.sentry.io https://*.ingest.us.sentry.io https://www.google.com`,
  `frame-src 'self' https://js.stripe.com https://*.firebaseapp.com https://www.google.com`,
  `worker-src 'self' blob:`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspHeader },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self)',
  },
];

/** @type {import('next').NextConfig} */
export default withSentryConfig(
  bundleAnalyzer(
    withNextIntl({
      eslint: {
        dirs: ['.'],
      },
      poweredByHeader: false,
      reactStrictMode: true,

      async headers() {
        return [
          {
            source: '/(.*)',
            headers: securityHeaders,
          },
        ];
      },

      images: {
        // Современные форматы: сначала AVIF (легче), затем WebP — next/image
        // сам отдаёт подходящий по заголовку Accept браузера.
        formats: ['image/avif', 'image/webp'],
        // Firebase Storage и Google-аватары (фото из Google-аккаунта)
        remotePatterns: [
          { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
          { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
          { protocol: 'https', hostname: 'i.ibb.co' },
        ],
      },
    }),
  ),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
    // Задаётся из окружения (Vercel → Settings → Environment Variables).
    // Если не заданы — плагин просто пропустит загрузку source maps (не падает).
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Disable Sentry telemetry
    telemetry: false,
  },
);
