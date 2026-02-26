import Link from 'next/link';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import SectionLabel from '@/components/shared/SectionLabel';
import ArrowIcon from '@/components/shared/ArrowIcon';

export default function ServicesOverview({ locale, dict }) {
  const serviceNames = dict.serviceNames;

  return (
    <section className="py-32 md:py-48 px-8 md:px-12 bg-card">
      <div className="max-w-[1400px] mx-auto">
        <div className="md:grid md:grid-cols-12 gap-8">
          <RevealOnScroll className="md:col-span-3 mb-10 md:mb-0">
            <SectionLabel>{dict.whatWeDo}</SectionLabel>
          </RevealOnScroll>
          <RevealOnScroll className="md:col-span-9 space-y-0">
            {serviceNames.map((name, i) => (
              <Link
                key={name}
                href={`/${locale}/services`}
                className={`group block ${i < serviceNames.length - 1 ? 'border-b border-border-subtle' : ''} py-8 md:py-10`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl md:text-4xl font-200 text-ink-muted group-hover:text-ink transition-colors">{name}</span>
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
