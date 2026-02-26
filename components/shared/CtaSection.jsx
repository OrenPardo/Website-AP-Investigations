import Link from 'next/link';
import RevealOnScroll from './RevealOnScroll';
import SectionLabel from './SectionLabel';

export default function CtaSection({ locale, label, headingLine1, headingBold, buttonText, subtext, bgClass = '' }) {
  return (
    <section className={`py-32 md:py-48 px-8 md:px-12 ${bgClass}`}>
      <RevealOnScroll className="max-w-[1400px] mx-auto">
        <div className="md:grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            {label && <SectionLabel className="block mb-4">{label}</SectionLabel>}
            <h2 className="text-3xl md:text-5xl font-200 leading-tight">
              {headingLine1}<br /><span className="font-600">{headingBold}</span>
            </h2>
          </div>
          <div className="md:col-span-5 mt-10 md:mt-0 md:text-end">
            <Link href={`/${locale}/contact`} className="inline-block bg-ink text-surface text-sm font-500 px-10 py-4 hover:opacity-80 transition-opacity">
              {buttonText}
            </Link>
            {subtext && <p className="text-ink-muted text-sm font-300 mt-4">{subtext}</p>}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
