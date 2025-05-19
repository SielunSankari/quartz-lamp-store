'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const advantagesItems = [
  { icon: '/assets/images/adv-icon-1.svg' },
  { icon: '/assets/images/adv-icon-2.svg' },
  { icon: '/assets/images/adv-icon-3.svg' },
];

const Advantages = () => {
  const t = useTranslations('Advantages');

  return (
    <div className="bg-gray-50">
      <div className="container px-4 mx-auto py-10 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center md:pb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 p-4 md:p-6">
            {advantagesItems.map((item, index) => (
              <motion.div
                key={item.icon}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md flex flex-col items-center transition-shadow"
              >
                <div className="mb-4 p-6">
                  <Image
                    alt={t(`items.${index}.title`)}
                    src={item.icon}
                    width={120}
                    height={120}
                    className="mx-auto transition-transform"
                  />
                </div>
                <div className="px-6 pb-8 text-center">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                    {t(`items.${index}.title`)}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600">
                    {t(`items.${index}.description`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advantages;
