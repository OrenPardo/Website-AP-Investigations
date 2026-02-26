import { locales } from '@/i18n/config';

const BASE_URL = 'https://alonpardo.co.il';

const routes = ['', '/services', '/about', '/contact'];

export default function sitemap() {
  const entries = [];

  for (const route of routes) {
    const languages = {};
    for (const locale of locales) {
      languages[locale] = `${BASE_URL}/${locale}${route}`;
    }

    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date('2026-02-26'),
        alternates: { languages },
      });
    }
  }

  return entries;
}
