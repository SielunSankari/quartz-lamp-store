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
    <div className="min-h-screen flex flex-col text-gray-700  bg-gray-100 antialiased">
      <header className="border-b border-gray-300 pb-8 pt-6 w-full px-0.5 md:px-0.5 mx-auto max-w-screen-md flex-1">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex flex-col gap-2 items-start text-left">
            <Image
              src="/Logo.svg"
              alt="baimed"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
          </div>
        </div>

        {/* Bottom part: Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <nav>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-base md:text-lg font-medium text-gray-800">
              {props.leftNav}
            </ul>
          </nav>

          <nav>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-base md:text-lg font-medium text-gray-800">
              {props.rightNav}
            </ul>
          </nav>
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
