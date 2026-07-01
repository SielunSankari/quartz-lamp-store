import Profile from '@/components/Profile'; // Если компонент действительно находится здесь
import { routing } from '@/libs/i18nNavigation';
import { buildAlternates } from '@/utils/Helpers';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type IUserProfilePageProps = {
  params: Promise<{ locale?: string }>; // Сделали params асинхронным
};

export async function generateMetadata({ params }: IUserProfilePageProps) {
  const resolvedParams = await params; // Добавили await для params
  const locale = resolvedParams?.locale || routing.defaultLocale;

  const t = await getTranslations({
    locale,
    namespace: 'UserProfile',
  });

  return {
    title: t('meta_title'),
    alternates: buildAlternates('/personal/user-profile', locale),
  };
}

export default async function UserProfilePage({ params }: IUserProfilePageProps) {
  const resolvedParams = await params; // Добавили await для params
  const locale = resolvedParams?.locale || routing.defaultLocale;

  await setRequestLocale(locale); // Убедились в асинхронности

  return (
    <div>
      <Profile />
    </div>
  );
}
