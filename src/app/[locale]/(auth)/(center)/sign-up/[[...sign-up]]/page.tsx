import { AuthButtons } from '@/components/AuthButtons';
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
  };
}

export default async function SignUpPage({ params }: ISignUpPageProps) {
  const resolvedParams = await params; // Ожидаем params
  const locale = resolvedParams?.locale || 'ru'; // Используем значение по умолчанию, если locale отсутствует

  await setRequestLocale(locale); // Убедитесь, что это асинхронно

  return (
    <div>
      <AuthButtons locale={locale} />
    </div>
  );
}
