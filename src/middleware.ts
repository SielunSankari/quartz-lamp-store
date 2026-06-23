import type { NextFetchEvent, NextRequest } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { detectBot } from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './libs/i18nNavigation';

const intlMiddleware = createMiddleware(routing);

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

  // API-маршруты (Stripe checkout/webhook) пропускаем без i18n и проверки ботов —
  // иначе вебхук Stripe будет принят за бота и заблокирован.
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }

  // Защита от ботов (если задан ARCJET_KEY).
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);
    if (decision.isDenied()) {
      throw new Error(decision.reason.isBot() ? 'No bots allowed' : 'Access denied');
    }
  }

  // Локализация (kz/ru) — для всех остальных страниц.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next|monitoring|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/:locale/sign-in(.*)',
  ],
};
