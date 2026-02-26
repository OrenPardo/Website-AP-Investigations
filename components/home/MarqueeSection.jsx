import RevealOnScroll from '@/components/shared/RevealOnScroll';
import SectionLabel from '@/components/shared/SectionLabel';

export default function MarqueeSection({ dict }) {
  const repeats = 4;
  const items = dict.marqueeItems;

  return (
    <section className="py-24 md:py-32 bg-card overflow-hidden">
      <RevealOnScroll className="max-w-[1400px] mx-auto px-8 md:px-12 mb-10">
        <SectionLabel>{dict.workingWith}</SectionLabel>
      </RevealOnScroll>
      <RevealOnScroll className="marquee" aria-label={dict.marqueeAriaLabel}>
        <div className="marquee-track">
          {Array.from({ length: repeats }).map((_, ri) =>
            items.map((item, ii) => (
              <span key={`${ri}-${ii}`}>
                <span className="marquee-item">{item}</span>
                <span className="marquee-sep" aria-hidden="true">/</span>
              </span>
            ))
          )}
        </div>
      </RevealOnScroll>
    </section>
  );
}
