export default function Footer({ dict }) {
  return (
    <footer className="px-8 md:px-12 py-10 border-t border-border-subtle">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-sm font-300 text-ink-muted">
        <span>{dict.copyright}</span>
        <div className="flex gap-6">
          <a href="tel:+972524203401" dir="ltr" className="hover:text-ink transition-colors">052-420-3401</a>
          <a href="mailto:pardoal003@gmail.com" className="hover:text-ink transition-colors">pardoal003@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}
