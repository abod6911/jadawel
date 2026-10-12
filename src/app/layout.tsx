import type { Metadata, Viewport } from 'next';
import { Readex_Pro, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

// 1. Heading Font: Architectural & Cultural Authority
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

// 2. Body, UI & Numbers Font: Clean, Readable & Native
const readexPro = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080B11',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://abod6911.github.io/jadawel'),
  title: 'جداول (Jadawel) — وش الخطة؟ | المخطط الذكي لرحلات وطلعات جدة',
  description: 'المواقع تعطيك مئات الأماكن وتخليك محتار.. جداول يرتّب لك الطلعة كاملة بنقرة واحدة في عروس البحر الأحمر.',
  applicationName: 'جداول | Jadawel',
  authors: [{ name: 'Jadawel Team' }],
  creator: 'Jadawel',
  publisher: 'Jadawel',
  alternates: {
    canonical: 'https://abod6911.github.io/jadawel/',
    languages: {
      'ar-SA': 'https://abod6911.github.io/jadawel/',
      'en-US': 'https://abod6911.github.io/jadawel/?lang=en',
    },
  },
  openGraph: {
    title: 'جداول (Jadawel) — المخطط الذكي لرحلات وطلعات جدة',
    description: 'خطط مسارك في عروس البحر الأحمر بدقة متناهية.. شواطئ أبحر، أزقة البلد، مطاعم وكافيهات مختارة مع حساب الميزانية والتنقل.',
    url: 'https://abod6911.github.io/jadawel/',
    siteName: 'جداول | Jadawel',
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: '/jadawel/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'جداول (Jadawel) — المخطط الذكي لطلعات جدة',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جداول (Jadawel) — المخطط الذكي لرحلات وطلعات جدة',
    description: 'المواقع تعطيك مئات الأماكن وتخليك محتار.. جداول يرتّب لك الطلعة كاملة بنقرة واحدة في عروس البحر الأحمر.',
    images: ['/jadawel/og-image.jpg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'جداول | Jadawel',
  },
  formatDetection: {
    telephone: false,
  },
  keywords: [
    'جداول',
    'جدة',
    'البلد التاريخية',
    'كورنيش جدة',
    'جدول سياحي جدة',
    'مطاعم جدة',
    'أبحر',
    'تيم لاب جدة',
    'Jeddah itinerary',
    'Jadawel',
    'خطط جدة',
    'سياحة جدة',
  ],
  icons: {
    icon: '/jadawel/images/brand/jadawel-logo.svg',
    apple: '/jadawel/images/brand/jadawel-logo.svg',
  },
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://abod6911.github.io/jadawel/#website',
      url: 'https://abod6911.github.io/jadawel/',
      name: 'جداول — المخطط الذكي لرحلات وطلعات جدة',
      alternateName: 'Jadawel',
      description: 'المخطط الذكي لرحلات وطلعات جدة. خطط مسارك السينمائي في عروس البحر الأحمر بنقرة واحدة.',
      inLanguage: ['ar-SA', 'en-US'],
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://abod6911.github.io/jadawel/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'TouristTrip',
      '@id': 'https://abod6911.github.io/jadawel/#trip',
      name: 'مسارات وخطط طلعات جدة المتكاملة',
      description: 'جداول سياحية وترفيهية متكاملة في أبحر، البلد التاريخية، وكورنيش جدة مع حساب الميزانية ومشاوير النقل.',
      touristType: ['Families', 'Friends', 'Solo Explorers'],
      itinerary: {
        '@type': 'ItemList',
        numberOfItems: 3,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'البلد التاريخية - جدة التاريخية',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'نادي جدة لليخوت والمارينا',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'واجهة روشن البحرية وكورنيش جدة',
          },
        ],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-theme="dark"
      className={`dark h-full ${ibmPlexArabic.variable} ${readexPro.variable}`}
    >
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-obsidian text-pearl font-arabic antialiased selection:bg-gold-500/30 selection:text-gold-300 overflow-x-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        {children}
      </body>
    </html>
  );
}
