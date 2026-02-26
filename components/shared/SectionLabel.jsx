export default function SectionLabel({ children, className = '' }) {
  return (
    <span className={`text-[11px] font-500 tracking-[0.3em] text-ink-light uppercase ${className}`}>
      {children}
    </span>
  );
}
