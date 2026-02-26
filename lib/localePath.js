import { defaultLocale } from '@/i18n/config';

export default function localePath(locale, path = '') {
  if (locale === defaultLocale) {
    return path || '/';
  }
  return `/${locale}${path}`;
}
