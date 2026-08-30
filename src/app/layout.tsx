import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#07151E',
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
    icon: '/images/brand/jadawel-logo.jpg',
    apple: '/images/brand/jadawel-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-abyss text-pearl antialiased selection:bg-coral-500 selection:text-white overflow-x-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        {children}
      </body>
    </html>
  );
}
