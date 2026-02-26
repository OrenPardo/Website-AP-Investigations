import HeroSection from '@/components/home/HeroSection';
import ServicesOverview from '@/components/home/ServicesOverview';
import StatementSection from '@/components/home/StatementSection';
import MarqueeSection from '@/components/home/MarqueeSection';
import CtaSection from '@/components/shared/CtaSection';
import getDictionary from '@/dictionaries/getDictionary';
import getJsonLd from '@/data/getJsonLd';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const m = dict.meta;

  return {
    title: m.homeTitle,
    description: m.homeDescription,
    openGraph: {
      title: m.homeOgTitle,
      description: m.homeOgDescription,
    },
    alternates: {
      canonical: locale === 'he' ? '/' : '/en',
      languages: { he: '/', en: '/en' },
    },
  };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const jsonLd = getJsonLd(dict.jsonLd, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection dict={dict.home} />
      <ServicesOverview locale={locale} dict={dict.home} />
      <StatementSection dict={dict.home} />
      <MarqueeSection dict={dict.home} />
      <CtaSection
        locale={locale}
        label={dict.home.ctaLabel}
        headingLine1={dict.home.ctaLine1}
        headingBold={dict.home.ctaBold}
        buttonText={dict.home.ctaButton}
        subtext={dict.home.ctaSubtext}
      />
    </>
  );
}
