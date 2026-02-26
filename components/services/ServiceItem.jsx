import RevealOnScroll from '@/components/shared/RevealOnScroll';

export default function ServiceItem({ number, titleParts, paragraphs }) {
  return (
    <RevealOnScroll className="border-t border-border-subtle py-16 md:py-24 md:grid md:grid-cols-12 gap-8">
      <div className="md:col-span-4 mb-6 md:mb-0">
        <span className="text-ink-light text-xs font-300 tracking-[0.2em]">{number}</span>
        <h2 className="text-2xl md:text-3xl font-200 mt-2">
          {titleParts.map((part, i) => (
            <span key={i} className={part.bold ? 'font-600' : ''}>{part.text}</span>
          ))}
        </h2>
      </div>
      <div className="md:col-span-7 md:col-start-6 text-ink-muted font-300 leading-relaxed space-y-4">
        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </RevealOnScroll>
  );
}
