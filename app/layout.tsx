import './globals.css';
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';
import { HeaderWithPath } from '@/components/layout/HeaderWithPath';
import { Footer } from '@/components/layout/Footer';
import { buildCSP } from '@/lib/csp';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-cormorant',
  preload: true,
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains',
  preload: false,
});

// CSP is built per-environment in lib/csp.ts. Production keeps the strict
// policy (no 'unsafe-eval'); dev adds 'unsafe-eval' so Next.js HMR/eval-based
// React Refresh can run without breaking client hydration.
const CSP = buildCSP();

export const metadata = {
  title: { default: 'Vasconcelos & Pires Advogados Associados', template: '%s · Vasconcelos & Pires' },
  description: 'Escritório boutique de direito empresarial em São Paulo. Atuação em societário, tributário, compliance e arbitragem.',
  referrer: 'strict-origin-when-cross-origin' as const,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Vasconcelos & Pires',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' as const },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
      </head>
      <body>
        <HeaderWithPath />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
