import RevealOnScroll from '@/components/shared/RevealOnScroll';
import SectionLabel from '@/components/shared/SectionLabel';

export default function NarrativeSection({ dict }) {
  return (
    <section className="py-24 md:py-32 px-8 md:px-12 bg-card">
      <div className="max-w-[1400px] mx-auto">
        <div className="md:grid md:grid-cols-12 gap-8">
          <RevealOnScroll className="md:col-span-3 mb-10 md:mb-0">
            <SectionLabel>{dict.sectionLabel}</SectionLabel>
          </RevealOnScroll>
          <RevealOnScroll className="md:col-span-8">
            <div className="space-y-6 text-ink-muted font-300 leading-relaxed text-lg">
              <p>{dict.narrative1}</p>
              <p>{dict.narrative2}</p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
