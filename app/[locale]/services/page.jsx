import PageHeader from '@/components/shared/PageHeader';
import ServiceItem from '@/components/services/ServiceItem';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import CtaSection from '@/components/shared/CtaSection';
import getDictionary from '@/dictionaries/getDictionary';
import renderBold from '@/lib/renderBold';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const m = dict.meta;

  return {
    title: m.servicesTitle,
    description: m.servicesDescription,
    openGraph: {
      title: m.servicesOgTitle,
      description: m.servicesOgDescription,
    },
    alternates: {
      canonical: `/${locale}/services`,
      languages: { he: '/he/services', en: '/en/services' },
    },
  };
}

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const s = dict.services;

  return (
    <>
      <PageHeader
        line1={s.headerLine1}
        line2={s.headerLine2}
        description={s.headerDesc}
      />

      <section className="px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          {s.items.map((service) => (
            <ServiceItem key={service.number} {...service} />
          ))}
        </div>
      </section>

      <section className="py-32 md:py-48 px-8 md:px-12 bg-card">
        <RevealOnScroll className="max-w-[1400px] mx-auto">
          <p className="text-2xl md:text-4xl font-200 leading-snug max-w-3xl">
            {renderBold(s.statement)}
          </p>
        </RevealOnScroll>
      </section>

      <CtaSection
        locale={locale}
        label={s.ctaLabel}
        headingLine1={s.ctaLine1}
        headingBold={s.ctaBold}
        buttonText={s.ctaButton}
        subtext={s.ctaSubtext}
      />
    </>
  );
}
