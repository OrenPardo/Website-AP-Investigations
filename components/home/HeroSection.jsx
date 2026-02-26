import RevealOnScroll from '@/components/shared/RevealOnScroll';

export default function HeroSection({ dict }) {
  return (
    <section className="min-h-screen flex flex-col justify-center relative px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto w-full">
        <RevealOnScroll as="h1">
          <span className="block text-[clamp(2.5rem,8vw,7rem)] font-100 leading-[0.95] tracking-tight">{dict.heroLine1}</span>
          <span className="block text-[clamp(2.5rem,8vw,7rem)] font-700 leading-[0.95] tracking-tight me-[5vw]">{dict.heroLine2}</span>
        </RevealOnScroll>

        <RevealOnScroll className="mt-12 md:mt-16 me-auto md:me-[30vw] max-w-md">
          <div className="hr mb-6"></div>
          <p className="text-ink-muted text-base font-300 leading-relaxed">
            {dict.heroDesc1}<br />
            {dict.heroDesc2}
          </p>
        </RevealOnScroll>
      </div>

      <RevealOnScroll className="absolute bottom-10 left-1/2 -translate-x-1/2 text-ink-light text-xs font-300 tracking-[0.3em] uppercase">
        {dict.scroll}
      </RevealOnScroll>
    </section>
  );
}
