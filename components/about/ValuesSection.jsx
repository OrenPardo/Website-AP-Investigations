import RevealOnScroll from '@/components/shared/RevealOnScroll';
import SectionLabel from '@/components/shared/SectionLabel';

export default function ValuesSection({ dict }) {
  const values = dict.values;

  return (
    <section className="py-24 md:py-32 px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="md:grid md:grid-cols-12 gap-8">
          <RevealOnScroll className="md:col-span-3 mb-10 md:mb-0">
            <SectionLabel>{dict.valuesLabel}</SectionLabel>
          </RevealOnScroll>
          <RevealOnScroll className="md:col-span-9">
            {values.map((value, i) => (
              <div key={value.title} className={`${i < values.length - 1 ? 'border-b border-border-subtle' : ''} py-8 md:py-10`}>
                <div className="md:flex items-baseline gap-12">
                  <h3 className="text-2xl md:text-3xl font-200 md:w-48 shrink-0 mb-3 md:mb-0">{value.title}</h3>
                  <p className="text-ink-muted font-300 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
