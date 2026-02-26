import PageHeader from '@/components/shared/PageHeader';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import getDictionary from '@/dictionaries/getDictionary';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const m = dict.meta;

  return {
    title: m.contactTitle,
    description: m.contactDescription,
    openGraph: {
      title: m.contactOgTitle,
      description: m.contactOgDescription,
    },
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { he: '/he/contact', en: '/en/contact' },
    },
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <PageHeader
        line1={dict.contact.headerLine1}
        line2={dict.contact.headerLine2}
        description={dict.contact.headerDesc}
        paddingClass="pt-40 md:pt-52 pb-16 md:pb-20"
      />

      <section className="pb-32 md:pb-48 px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="md:grid md:grid-cols-12 gap-16">
            <RevealOnScroll className="md:col-span-7">
              <ContactForm dict={dict.form} locale={locale} />
            </RevealOnScroll>
            <RevealOnScroll className="md:col-span-4 md:col-start-9 mt-16 md:mt-0">
              <ContactInfo dict={dict.contact} />
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
