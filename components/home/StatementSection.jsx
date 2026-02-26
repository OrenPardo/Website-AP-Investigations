import RevealOnScroll from '@/components/shared/RevealOnScroll';
import renderBold from '@/lib/renderBold';

export default function StatementSection({ dict }) {
  return (
    <section className="py-32 md:py-48 px-8 md:px-12">
      <RevealOnScroll className="max-w-[1400px] mx-auto">
        <p className="text-2xl md:text-4xl lg:text-5xl font-200 leading-snug max-w-4xl">
          {renderBold(dict.statement)}
        </p>
      </RevealOnScroll>
    </section>
  );
}
