const dictionaries = {
  he: () => import('./he.json').then((m) => m.default),
  en: () => import('./en.json').then((m) => m.default),
};

export default async function getDictionary(locale) {
  return dictionaries[locale]();
}
