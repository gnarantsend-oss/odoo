import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import DisclaimerModal from '@/components/disclaimer-modal';

import { ThemeProvider } from '@/components/theme-provider';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap', preload: true });

export const metadata: Metadata = {
  title: { template: '%s | Narhan TV', default: 'Narhan TV - Монгол кино' },
  description: 'Монгол кино үнэгүй үзнэ үү.',
  icons: { icon: '/logo.svg', apple: '/logo.svg' },
  other: { referrer: 'no-referrer-when-downgrade' },
  openGraph: {
    title: 'Narhan TV',
    description: 'Монголын тэргүүлэх стриминг платформ.',
    siteName: 'Narhan TV',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Narhan TV' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Narhan TV',
    description: 'Монголын тэргүүлэх стриминг платформ.',
    images: ['/og-image.svg'],
  },
};

function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-border/40 bg-background/55 backdrop-blur-xl text-sm text-muted-foreground
                       ">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
          <p>&copy; 2026 Narhan TV. All Rights Reserved.</p>
          <p className="max-w-md text-xs opacity-60">
            All media content is provided by third-party services. Narhan TV does not claim
            ownership of any content linked or embedded on this site.
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
          <Link href="/dmca" className="hover:text-primary transition-colors">DMCA</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>

        <script dangerouslySetInnerHTML={{ __html: `
(function(){
  var VALID=['abyss','crimson','aurora','ember','forest'];
  var t=localStorage.getItem('narhan-theme');
  document.documentElement.setAttribute('data-theme',VALID.includes(t)?t:'abyss');
})();
        `}} />
      </head>
      <body className={cn('font-sans antialiased flex flex-col min-h-screen', nunito.variable)}>
        <script dangerouslySetInnerHTML={{__html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`}} />


        <ThemeProvider>
          <DisclaimerModal />
          <div className="relative z-10 flex-grow">
            {children}
          </div>
          <Footer />

        </ThemeProvider>
        
      </body>
    </html>
  );
}
