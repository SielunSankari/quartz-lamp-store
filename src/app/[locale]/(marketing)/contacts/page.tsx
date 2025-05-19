import { getTranslations, setRequestLocale } from 'next-intl/server';

type IContactProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata(props: IContactProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Contacts',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Contacts(props: IContactProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Contacts',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {t('title')}
      </h1>

      {/* Контактная информация */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="space-y-3">
          <p>
            <strong className="text-gray-600">
              {t('phone_label')}
              :
            </strong>
            {' '}
            <span className="text-gray-800">8 (747) 257-63-93</span>
          </p>
          <p>
            <strong className="text-gray-600">
              {t('email_label')}
              :
            </strong>
            {' '}
            <a
              className="text-blue-600 hover:underline"
              href="mailto:baimed@inbox.ru"
            >
              baimed@inbox.ru
            </a>
          </p>
        </div>
      </div>

      {/* Наша локация */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {t('our_locations')}
        </h2>
        <ul className="space-y-4">
          <li>
            <strong className="text-gray-600">
              {t('astana')}
              :
            </strong>
            {' '}
            <span className="text-gray-800">{t('astana_address')}</span>
          </li>
          <li>
            <strong className="text-gray-600">
              {t('almaty')}
              :
            </strong>
            {' '}
            <span className="text-gray-800">{t('almaty_address')}</span>
          </li>
          <li>
            <strong className="text-gray-600">
              {t('karaganda')}
              :
            </strong>
            {' '}
            <span className="text-gray-800">{t('karaganda_address')}</span>
          </li>
          <li>
            <strong className="text-gray-600">
              {t('pavlodar')}
              :
            </strong>
            {' '}
            <span className="text-gray-800">{t('pavlodar_address')}</span>
          </li>
          <li>
            <strong className="text-gray-600">
              {t('oskemen')}
              :
            </strong>
            {' '}
            <span className="text-gray-800">{t('oskemen_address')}</span>
          </li>
          <li>
            <strong className="text-gray-600">
              {t('semey')}
              :
            </strong>
            {' '}
            <span className="text-gray-800">{t('semey_address')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
