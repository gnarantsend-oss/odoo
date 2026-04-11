import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import DisclaimerModal from '@/components/disclaimer-modal';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Narhan TV',
    default: 'Narhan TV - Anime, Manga, Movies & TV Shows',
  },
  description: 'Монголын тэргүүлэх стриминг платформ. Anime, Manga, Movies, TV Shows үнэгүй үзнэ үү. free movie watch online anime free new movie drama free streaming 免费看电影 在线看电影 免费动漫 ver películas gratis anime gratis أفلام مجانية مشاهدة أنمي filmes grátis assistir anime смотреть фильмы бесплатно аниме бесплатно film gratuit anime gratuit kostenlos Filme Anime kostenlos 映画無料視聴 アニメ無料 영화 무료 보기 애니 무료 फ्री मूवी देखें ücretsiz film izle anime ücretsiz فیلم رایگان انیمه رایگان nonton film gratis xem phim miễn phí ดูหนังฟรี อนิเมะฟรี filmy za darmo gratis films kijken дивитися фільми безкоштовно тегін фильм көру bepul film korish libre na pelikula tonton filem percuma বিনামূল্যে মুভি দেখুন فری فلم دیکھیں סרטים בחינם үнэгүй кино үзэх аниме үнэгүй',
  keywords: ['free movie','watch movie online','anime free','new movie 2026','watch drama','free streaming','免费看电影','免费动漫','ver películas gratis','أفلام مجانية','filmes grátis','смотреть фильмы бесплатно','film gratuit','kostenlos Filme','映画無料視聴','영화 무료 보기','ücretsiz film izle','nonton film gratis','xem phim miễn phí','ดูหนังฟรี','filmy za darmo','үнэгүй кино үзэх'],
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  other: {
    referrer: 'no-referrer-when-downgrade',
  },
  openGraph: {
    title: 'Narhan TV',
    description: 'Монголын тэргүүлэх стриминг платформ. Anime, Manga, Movies, TV Shows үнэгүй үзнэ үү.',
    url: 'https://narhantv.com',
    siteName: 'Narhan TV',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Narhan TV',
      },
    ],
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
    <footer className="w-full border-t border-border/40 bg-background text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
          <p>&copy; {new Date().getFullYear()} Narhan TV. All Rights Reserved.</p>
          <p className="max-w-md text-xs">
            All media content is provided by third-party services.
            Narhan TV does not claim ownership of any anime, movies, TV shows, or manga linked or embedded on this site.
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
          <Link href="/dmca" className="hover:text-primary transition-colors">DMCA Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn('font-sans antialiased flex flex-col min-h-screen', nunito.variable)}>
        <script dangerouslySetInnerHTML={{__html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`}} />
        <DisclaimerModal />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
