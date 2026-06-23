import { AppConfig } from '@/utils/AppConfig';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export const BaseTemplate = (props: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const t = useTranslations('BaseTemplate');

  return (
    <div className="min-h-screen flex flex-col text-ink bg-paper antialiased">
      {/* Полноширинная стеклянная sticky-шапка */}
      <header className="sticky top-0 z-50 w-full border-b border-white/50 bg-white/40 shadow-[0_8px_30px_-14px_rgba(15,23,42,0.12)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
          {/* Лого */}
          <Image
            src="/Logo.svg"
            alt="baimed"
            width={48}
            height={48}
            className="h-11 w-auto shrink-0"
          />

          {/* Навигация + действия (справа) */}
          <div className="flex flex-1 flex-wrap items-center justify-end gap-x-7 gap-y-2">
            <nav>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 text-base font-medium text-gray-800">
                {props.leftNav}
              </ul>
            </nav>

            <nav>
              <ul className="flex items-center gap-4 text-sm font-medium text-gray-800">
                {props.rightNav}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-36 2xl:px-48">{props.children}</main>

      {/* Футер */}
      <footer>
        <div className="bg-sky-600 px-6 sm:px-6 md:px-12 lg:px-24 xl:px-36 2xl:px-48">
          <div className="flex justify-center items-center space-x-4 text-white py-3">
            <a
              href="https://wa.me/your-number"
              className="hover:text-sky-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="w-6 h-6" />
            </a>
            <a
              href="https://tiktok.com/@your-account"
              className="hover:text-sky-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/your-account"
              className="hover:text-sky-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
          </div>

        </div>

        <div className="bg-neutral-800 py-6 text-center text-sm text-white">
          <span>
            © Copyright 2012 –&nbsp;
            {new Date().getFullYear()}
            &nbsp;
            {AppConfig.name}
          </span>
          <div>
            {t.rich('made_with', {
              author: () => (
                <a
                  href="https://github.com/SielunSankari"
                  className="text-violet-400 hover:border-b hover:border-blue-400"
                >
                  Batyrzhan Baitubaev
                </a>
              ),
            })}
          </div>
        </div>
      </footer>
    </div>
  );
};
