import { AuthForm } from '@/components/AuthForm';
import { buildAlternates } from '@/utils/Helpers';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type ISignUpPageProps = {
  params: Promise<{ locale?: string }>; // Делаем params асинхронным
};

export async function generateMetadata({ params }: ISignUpPageProps) {
  const resolvedParams = await params; // Ожидаем params
  const locale = resolvedParams?.locale || 'ru'; // Используем значение по умолчанию, если locale отсутствует

  const t = await getTranslations({
    locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    alternates: buildAlternates('/sign-up', locale),
  };
}

export default async function SignUpPage({ params }: ISignUpPageProps) {
  const resolvedParams = await params; // Ожидаем params
  const locale = resolvedParams?.locale || 'ru'; // Используем значение по умолчанию, если locale отсутствует

  await setRequestLocale(locale); // Убедитесь, что это асинхронно

  return (
    <div>
      <AuthForm mode="signup" locale={locale} />
    </div>
  );
}
