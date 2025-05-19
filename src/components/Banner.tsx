'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Вынес кнопки в отдельный компонент
const ActionButtons = ({ t }: { t: any }) => (
  <div className="flex gap-4 py-12">
    <Link href="/products" className="inline-block">
      <Button className="p-7 text-lg font-normal tracking-wide">
        {t('buy_now')}
      </Button>
    </Link>

    <Link
      href="https://kaspi.kz/shop/search/?text=BAIMED&q=%3AavailableInZones%3AMagnum_ZONE5&sort=relevance&filteredByCategory=false&sc="
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <Button
        variant="outline"
        className="p-7 text-lg font-normal tracking-wide
      border-red-600 text-red-600
      hover:bg-red-600 hover:text-white
      transition-colors
      rounded-md
      focus-visible:ring-2 focus-visible:ring-red-400
      focus-visible:ring-offset-2"
      >
        {t('kaspi_store')}
      </Button>
    </Link>
  </div>
);

const Banner = () => {
  const t = useTranslations('Banner');

  const slides = [
    {
      title: t('title1'),
      subtitle: t('subtitle1'),
      image: {
        background: '/assets/images/blob-1.svg',
        overlay: '/assets/images/Obluchatel.png',
        alt: 'Obluchatel',
        inlineImage: '/assets/images/thumbs-up-man.png',
      },
    },
    {
      title: t('title2'),
      subtitle: t('subtitle2'),
      image: {
        background: '/assets/images/blob-2.svg',
        overlay: '/assets/images/Box.png',
        alt: 'overlay',
      },
    },
    {
      title: t('title3'),
      subtitle: t('subtitle3'),
      image: {
        background: '/assets/images/blob-3.svg',
        overlay: '/assets/images/Certificate.jpg',
        alt: 'certificate',
      },
    },
  ];

  return (
    <div className="bg-gray-100 mt-2">
      <Swiper
        spaceBetween={30}
        centeredSlides
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title} className="cursor-pointer">
            <section className={`container ${index !== 0 ? 'md:pt-10 md:pb-5' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                {/* Левая колонка */}
                <div className="relative">
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold py-4 text-gray-900">
                    {index === 0
                      ? (
                          <span className="inline">
                            {slide.title}
                            <Image
                              alt={slide.image.alt}
                              src={slide.image.inlineImage!}
                              width={50}
                              height={50}
                              className="inline-block w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20"
                            />
                          </span>
                        )
                      : (
                          slide.title
                        )}
                  </h1>
                  <p className="py-4 text-base md:text-xl text-gray-700">
                    {slide.subtitle}
                  </p>
                  <ActionButtons t={t} />
                </div>

                {/* Правая колонка */}
                <div className="relative w-full h-[400px] md:h-[400px] lg:h-[500px]">
                  <Image
                    alt="background"
                    src={slide.image.background}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      alt={slide.image.alt}
                      src={slide.image.overlay}
                      width={index === 2 ? 300 : 350}
                      height={index === 2 ? 350 : 400}
                      className="shadow-xl"
                    />
                  </div>
                </div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
