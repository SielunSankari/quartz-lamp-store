'use client';

import { routing, usePathname } from '@/libs/i18nNavigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Locale = 'ru' | 'kz';

export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations('language');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (selectedLocale: Locale) => {
    router.push(`/${selectedLocale}${pathname}`);
    router.refresh();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Image
          src={`/assets/images/${locale}.svg`}
          alt="Language flag"
          width={34}
          height={34}
          className="hover:opacity-80 transition-opacity
                drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
          <div className="flex flex-col p-2 gap-2">
            {(routing.locales as Locale[]).map(localeCode => (
              <button
                key={localeCode}
                type="button"
                onClick={() => handleLocaleChange(localeCode)}
                className="flex items-center hover:bg-gray-100 p-2 rounded justify-between w-full"
              >
                <div className="flex items-center">
                  <Image
                    src={`/assets/images/${localeCode}.svg`}
                    alt="Language flag"
                    width={24}
                    height={24}
                    className="flex-shrink-0"
                  />
                  <span className="ml-2 text-sm whitespace-nowrap">
                    {t(localeCode)}
                  </span>
                </div>
                {localeCode === locale && (
                  <span className="text-blue-500 ml-2">●</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
