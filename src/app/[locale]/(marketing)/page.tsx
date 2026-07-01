import Banner from '@/components/Banner';
import Branches from '@/components/Branches';
import { JsonLd } from '@/components/JsonLd';
import Scenarios from '@/components/Scenarios';
import Trust from '@/components/Trust';
import WorkingPrinciple from '@/components/WorkingPrinciple';
import { AppConfig } from '@/utils/AppConfig';
import { buildAlternates, getBaseUrl } from '@/utils/Helpers';

import { getTranslations, setRequestLocale } from 'next-intl/server';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    alternates: buildAlternates('/', locale),
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const baseUrl = getBaseUrl();
  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': AppConfig.name,
    'url': baseUrl,
    'logo': `${baseUrl}/icon-512.png`,
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+7-747-257-63-93',
      'contactType': 'customer service',
      'areaServed': 'KZ',
    },
  };
  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': AppConfig.name,
    'url': baseUrl,
  };

  return (
    <>
      <JsonLd data={organizationLd} />
      <JsonLd data={websiteLd} />
      <Banner />
      <Scenarios />
      <WorkingPrinciple />
      <Branches />
      <Trust />
    </>
  );
};
