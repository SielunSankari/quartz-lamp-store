import { AuthForm } from '@/components/AuthForm';
import { routing } from '@/libs/i18nNavigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type ISignInPageProps = {
  params: Promise<{ locale?: string }>; // Делаем params асинхронным
};

export async function generateMetadata({ params }: ISignInPageProps) {
  const resolvedParams = await params; // Ожидаем params
  const locale = resolvedParams?.locale || routing.defaultLocale; // Используем defaultLocale, если locale отсутствует

  const t = await getTranslations({
    locale,
    namespace: 'SignIn',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function SignInPage({ params }: ISignInPageProps) {
  const resolvedParams = await params; // Ожидаем params
  const locale = resolvedParams?.locale || routing.defaultLocale; // Используем defaultLocale, если locale отсутствует

  await setRequestLocale(locale); // Убедитесь, что это асинхронно

  return (
    <div>
      <AuthForm mode="signin" locale={locale} />
    </div>
  );
}
