import { CartFlyLayer } from '@/components/CartFlyLayer';
import { CitySelector } from '@/components/CitySelector';
import { ContactWidget } from '@/components/ContactWidget';
import { Footer } from '@/components/Footer';
import { MobileNav } from '@/components/MobileNav';
import { Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export const BaseTemplate = (props: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const t = useTranslations('BaseTemplate');

  return (
    <div className="min-h-screen flex flex-col text-ink bg-paper antialiased">
      {/* Тонкий топ-бар: слева город (привязан к аккаунту), справа — доставка */}
      <div className="w-full border-b border-slate-200/60 bg-paper">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
          <CitySelector />
          <span className="hidden items-center gap-1.5 font-sans text-xs text-slate-500 sm:flex">
            <Truck className="h-3.5 w-3.5 text-sky-600" strokeWidth={1.8} />
            {t('delivery')}
          </span>
        </div>
      </div>

      {/* Полноширинная sticky-шапка: почти белая (лёгкое стекло), чтобы тёплый
          фон под ней не «пачкал» шапку. */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-x-8 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Лого */}
          <Link href="/" aria-label="BAIMED" className="shrink-0">
            <Image
              src="/Logo.svg"
              alt="baimed"
              width={48}
              height={48}
              className="h-10 w-auto"
            />
          </Link>

          {/* Десктоп: обычное меню */}
          <div className="hidden flex-1 items-center justify-end gap-x-7 lg:flex">
            <nav>
              <ul className="flex items-center gap-x-6 text-base font-medium text-gray-800">
                {props.leftNav}
              </ul>
            </nav>

            <nav>
              <ul className="flex items-center gap-4 text-sm font-medium text-gray-800">
                {props.rightNav}
              </ul>
            </nav>
          </div>

          {/* Мобайл/планшет: бургер-меню */}
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-36 2xl:px-48">{props.children}</main>

      {/* Футер */}
      <Footer />

      {/* Слой анимации «товар летит в корзину» */}
      <CartFlyLayer />

      {/* Плавающий виджет связи */}
      <ContactWidget />
    </div>
  );
};
