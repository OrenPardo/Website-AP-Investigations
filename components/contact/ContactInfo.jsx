import SectionLabel from '@/components/shared/SectionLabel';

export default function ContactInfo({ dict }) {
  return (
    <div className="space-y-12">
      <div>
        <SectionLabel className="block mb-6">{dict.infoLabel}</SectionLabel>
        <div className="space-y-6">
          <div>
            <span className="text-xs text-ink-light font-300 block mb-1">{dict.phoneLabel}</span>
            <a href="tel:+972524203401" dir="ltr" className="text-lg font-300 hover:opacity-70 transition-opacity">052-420-3401</a>
          </div>
          <div>
            <span className="text-xs text-ink-light font-300 block mb-1">{dict.emailLabel}</span>
            <a href="mailto:pardoal003@gmail.com" className="text-lg font-300 hover:opacity-70 transition-opacity">pardoal003@gmail.com</a>
          </div>
        </div>
      </div>
      <div>
        <SectionLabel className="block mb-6">{dict.hoursLabel}</SectionLabel>
        <div className="space-y-2 text-sm font-300 text-ink-muted">
          <p>{dict.hoursWeekday}</p>
          <p>{dict.hoursFriday}</p>
          <p className="mt-4 text-ink">{dict.hoursUrgent}</p>
        </div>
      </div>
    </div>
  );
}
