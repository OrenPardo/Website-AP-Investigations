import OpeningStatement from '@/components/about/OpeningStatement';
import NarrativeSection from '@/components/about/NarrativeSection';
import ValuesSection from '@/components/about/ValuesSection';
import CtaSection from '@/components/shared/CtaSection';
import getDictionary from '@/dictionaries/getDictionary';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const m = dict.meta;

  return {
    title: m.aboutTitle,
    description: m.aboutDescription,
    openGraph: {
      title: m.aboutOgTitle,
      description: m.aboutOgDescription,
    },
    alternates: {
      canonical: locale === 'he' ? '/about' : '/en/about',
      languages: { he: '/about', en: '/en/about' },
    },
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const a = dict.about;

  return (
    <>
      <OpeningStatement dict={a} />
      <NarrativeSection dict={a} />
      <ValuesSection dict={a} />
      <CtaSection
        locale={locale}
        headingLine1={a.ctaLine1}
        headingBold={a.ctaBold}
        buttonText={a.ctaButton}
        subtext={a.ctaSubtext}
        bgClass="bg-card"
      />
    </>
  );
}
