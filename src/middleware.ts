import type { NextFetchEvent, NextRequest } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { detectBot } from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './libs/i18nNavigation';

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = (pathname: string) =>
  pathname.startsWith('/dashboard') || pathname.match(/^\/[a-z]{2}\/dashboard/);

const isAuthPage = (pathname: string) =>
  pathname.startsWith('/sign-in')
  || pathname.startsWith('/sign-up')
  || pathname.match(/^\/[a-z]{2}\/sign-in/)
  || pathname.match(/^\/[a-z]{2}\/sign-up/);

const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW', 'CATEGORY:MONITOR'],
  }),
);

export default async function middleware(
  request: NextRequest,
  _event: NextFetchEvent,
) {
  const { pathname } = request.nextUrl;

  // Логирование пути и локали
  // console.log('Request Path:', pathname);
  // console.log('Locale:', request.nextUrl.locale || routing.defaultLocale);

  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        throw new Error('No bots allowed');
      }

      throw new Error('Access denied');
    }
  }

  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }

  if (isAuthPage(pathname)) {
    // console.log('Auth page detected:', pathname);
    return intlMiddleware(request);
  }

  if (isProtectedRoute(pathname)) {
    // console.log('Protected route detected:', pathname);
    return intlMiddleware(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/sign-in(.*)', // Добавляем маршрут без локали
    '/sign-up(.*)', // Для регистрации
    '/:locale/sign-in(.*)', // Локализованные маршруты
    '/:locale/dashboard(.*)', // Локализованные защищенные маршруты
  ],
};
