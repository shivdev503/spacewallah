import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SpaceWallah · Coworking & Office Spaces in Delhi, Noida, Gurugram',
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Compare coworking spaces and office spaces across Delhi, Noida and Gurugram. Prices shown upfront, metro walking time on every space, free site visits and zero brokerage.',
  openGraph: { siteName: SITE_NAME, type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F6F2' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1513' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
      </head>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: SITE_URL,
          areaServed: ['Delhi', 'Noida', 'Gurugram'],
        }) }} />
      </body>
    </html>
  );
}
