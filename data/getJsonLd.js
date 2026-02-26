export default function getJsonLd(dict, locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: dict.name,
    description: dict.description,
    url: locale === 'he' ? 'https://alonpardo.co.il' : `https://alonpardo.co.il/${locale}`,
    telephone: '+972-52-420-3401',
    email: 'pardoal003@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
    },
    provider: {
      '@type': 'Person',
      name: dict.personName,
      jobTitle: dict.jobTitle,
    },
    areaServed: { '@type': 'Country', name: 'Israel' },
    availableLanguage: ['Hebrew', 'English'],
    serviceType: [
      'Private Investigation',
      'Insurance Investigation',
      'Surveillance',
      'Background Check',
      'Asset Tracing',
      'Corporate Investigation',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '08:00',
        closes: '13:00',
      },
    ],
  };
}
