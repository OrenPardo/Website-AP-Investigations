import RevealOnScroll from './RevealOnScroll';
import HorizontalRule from './HorizontalRule';

export default function PageHeader({ line1, line2, description, paddingClass = 'pt-40 md:pt-52 pb-20 md:pb-28' }) {
  return (
    <section className={`${paddingClass} px-8 md:px-12`}>
      <RevealOnScroll className="max-w-[1400px] mx-auto">
        <h1>
          <span className="block text-[clamp(2rem,6vw,5rem)] font-100 leading-[0.95] tracking-tight">{line1}</span>
          <span className="block text-[clamp(2rem,6vw,5rem)] font-700 leading-[0.95] tracking-tight">{line2}</span>
        </h1>
        {description && (
          <div className="mt-8 max-w-lg">
            <HorizontalRule />
            <p className="mt-6 text-ink-muted text-base font-300 leading-relaxed">{description}</p>
          </div>
        )}
      </RevealOnScroll>
    </section>
  );
}
