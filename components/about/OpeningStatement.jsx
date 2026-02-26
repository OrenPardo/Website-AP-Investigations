import RevealOnScroll from '@/components/shared/RevealOnScroll';
import renderBold from '@/lib/renderBold';

export default function OpeningStatement({ dict }) {
  return (
    <section className="min-h-[80vh] flex items-end px-8 md:px-12 pb-20 md:pb-28">
      <RevealOnScroll className="max-w-[1400px] mx-auto w-full">
        <p className="text-2xl md:text-4xl lg:text-5xl font-200 leading-snug max-w-4xl">
          {renderBold(dict.opening)}
        </p>
      </RevealOnScroll>
    </section>
  );
}
