import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
});

export const metadata = {
  metadataBase: new URL('https://evanscom.vercel.app'),
  title: {
    default: 'Evans Luxe Admin Lounge',
    template: '%s | Admin Lounge'
  },
  description: 'Evans Luxe Beauty Administrative Portal.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="theme-color" content="#5A2A6C" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Evans Admin" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/logo.jpg" />
      </head>
      <body className="bg-gray-100 min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
