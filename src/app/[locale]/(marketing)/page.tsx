import Banner from '@/components/Banner';
import Branches from '@/components/Branches';
import Scenarios from '@/components/Scenarios';
import Trust from '@/components/Trust';
import WorkingPrinciple from '@/components/WorkingPrinciple';

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
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <>
      <Banner />
      <Scenarios />
      <WorkingPrinciple />
      <Branches />
      <Trust />
    </>
  );
};
