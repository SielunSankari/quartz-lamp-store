import { CertificateViewer } from '@/components/CertificateViewer';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { StatsCounters } from '@/components/trust/StatsCounters';
import { useTranslations } from 'next-intl';

const Trust = () => {
  const t = useTranslations('Trust');

  return (
    <section className="my-12 overflow-hidden rounded-[2.5rem] bg-white md:my-16">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-slate-500 md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Анимированные счётчики */}
        <StatsCounters />

        {/* Карусель отзывов + форма */}
        <ReviewsSection />

        {/* Сертификаты */}
        <div className="mt-10 flex flex-col items-center gap-6 rounded-3xl sm:mt-16 border border-slate-200/70 bg-slate-50/70 p-8 text-center md:flex-row md:gap-8 md:p-10 md:text-left">
          <div className="flex shrink-0 items-center justify-center gap-4">
            <CertificateViewer src="/assets/images/Certificate.jpg" alt={t('certificate_doc_alt')} />
            <CertificateViewer src="/assets/images/Attestat-UF-lampyi.png" alt={t('certificate_alt')} />
          </div>
          <div>
            <h3 className="font-sans text-xl font-semibold text-slate-900">
              {t('certificates_title')}
            </h3>
            <p className="mt-2 max-w-md font-sans text-base leading-relaxed text-slate-500">
              {t('certificates_note')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
