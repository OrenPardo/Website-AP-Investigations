import { Heebo } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import getDictionary from '@/dictionaries/getDictionary';
import { locales } from '@/i18n/config';
import './globals.css';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-heebo',
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const m = dict.meta;

  return {
    metadataBase: new URL('https://alonpardo.co.il'),
    title: {
      default: m.siteTitle,
      template: m.siteTitleTemplate,
    },
    description: m.siteDescription,
    openGraph: {
      type: 'website',
      locale: locale === 'he' ? 'he_IL' : 'en_US',
    },
    twitter: {
      card: 'summary',
    },
    icons: {
      icon: '/favicon.svg',
    },
    other: {
      'theme-color': '#d5d9e2',
    },
    alternates: {
      languages: {
        he: '/',
        en: '/en',
      },
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'} className={heebo.variable}>
      <body className={`${heebo.className} bg-surface text-ink`}>
        <a href="#main" className="skip-link">{dict.skipLink}</a>
        <Navbar locale={locale} dict={dict.nav} />
        <main id="main">
          {children}
        </main>
        <Footer dict={dict.footer} />
      </body>
    </html>
  );
}
