'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { AiOutlineSafety } from 'react-icons/ai';
import { GiVirus } from 'react-icons/gi';
import { MdOutlineScience } from 'react-icons/md';

// Константа должна быть объявлена ДО компонента
const FEATURES = [
  { icon: 'virus' },
  { icon: 'science' },
  { icon: 'safety' },
];

const WorkingPrinciple = () => {
  const t = useTranslations('WorkingPrinciple');

  return (
    <section className="py-16">
      <div className="container">
        <div
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.rich('title', {
              highlight: chunks => <span className="text-sky-600">{chunks}</span>,
            })}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-4">
          {/* Левая колонка - Визуал с анимацией */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-[500px] mt-16 flex items-center justify-center rounded-3xl p-8"
          >
            <Image
              src="/assets/images/lamp.png"
              alt="Кварцевая лампа"
              width={600}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </motion.div>

          {/* Правая колонка - Особенности */}
          <div className="space-y-6 lg:space-y-8">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.icon}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-2 lg:gap-4 items-start p-5 lg:p-6 bg-white rounded-xl shadow-md transition-all"
              >
                <div className="p-2 lg:p-3 rounded-lg text-violet-600">
                  {feature.icon === 'virus' && <GiVirus className="w-6 h-6 lg:w-8 lg:h-8" />}
                  {feature.icon === 'safety' && <AiOutlineSafety className="w-6 h-6 lg:w-8 lg:h-8" />}
                  {feature.icon === 'science' && <MdOutlineScience className="w-6 h-6 lg:w-8 lg:h-8" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl font-semibold mb-1 lg:mb-2 text-gray-800">
                    {t(`features.${idx}.title`)}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    {t(`features.${idx}.description`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Предупреждающий баннер */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg"
        >
          <div className="flex items-center gap-4">
            <AiOutlineSafety className="w-8 h-8 text-red-600" />
            <p className="text-red-800">{t('warning')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkingPrinciple;
