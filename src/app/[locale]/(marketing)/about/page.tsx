import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';

type IAboutProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata(props: IAboutProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'About',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function About(props: IAboutProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'About',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {t('title')}
      </h1>

      {/* Основной контент */}
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Первый блок */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {t('about_our_store')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('store_description_1')}
          </p>
          <p className="text-gray-600">
            {t('store_description_2')}
          </p>
        </div>

        {/* Преимущества */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {t('why_choose_us')}
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-600">{t('advantage_1')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-600">{t('advantage_2')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-600">{t('advantage_3')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-600">{t('advantage_4')}</span>
            </li>
          </ul>
        </div>

        {/* Блок сертификата */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {t('certificate_title')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('certificate_description')}
          </p>
          <div className="flex justify-center">
            <Image
              src="/assets/images/Attestat-UF-lampyi.png"
              alt={t('certificate_alt')}
              width={600}
              height={800}
              className="rounded-lg border border-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
