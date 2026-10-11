import type { Metadata, Viewport } from 'next';
import { Readex_Pro, IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const readexPro = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-readex-pro',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B0D12',
};

export const metadata: Metadata = {
  title: 'جداول (Jadawel) — وش الخطة؟ | المخطط الذكي لرحلات وطلعات جدة',
  description: 'المواقع تعطيك مئات الأماكن وتخليك محتار.. جداول يرتّب لك الطلعة كاملة بنقرة واحدة في عروس البحر الأحمر.',
  applicationName: 'جداول',
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
    'جدول سياحي',
    'مطاعم جدة',
    'أبحر',
    'تيم لاب جدة',
    'Jeddah itinerary',
    'Jadawel',
    'خطط جدة'
  ],
  icons: {
    icon: '/images/brand/jadawel-logo.svg',
    apple: '/images/brand/jadawel-logo.svg',
  },
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
      className={`dark h-full ${readexPro.variable} ${ibmPlexArabic.variable} ${plusJakarta.variable}`}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-obsidian text-pearl font-arabic antialiased selection:bg-gold-500/30 selection:text-gold-300 overflow-x-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        {children}
      </body>
    </html>
  );
}
