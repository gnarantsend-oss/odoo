import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import DisclaimerModal from '@/components/disclaimer-modal';
import Script from 'next/script';


const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Narhan TV',
    default: 'Narhan TV - Anime, Manga, Movies & TV Shows',
  },
  description: 'Монголын тэргүүлэх стриминг платформ. Anime, Manga, Movies, TV Shows үнэгүй үзнэ үү. free movie watch online anime free new movie drama free streaming 免费看电影 在线看电影 免费动漫 ver películas gratis anime gratis أفلام مجانية مشاهدة أنمي filmes grátis assistir anime смотреть фильмы бесплатно аниме бесплатно film gratuit anime gratuit kostenlos Filme Anime kostenlos 映画無料視聴 アニメ無料 영화 무료 보기 애니 무료 फ्री मूवी देखें ücretsiz film izle anime ücretsiz فیلم رایگان انیمه رایگان nonton film gratis xem phim miễn phí ดูหนังฟรี อนิเมะฟรี filmy za darmo gratis films kijken дивитися фільми безкоштовно тегін фильм көру bepul film ko\'rish libre na pelikula tonton filem percuma বিনামূল্যে মুভি দেখুন فری فلم دیکھیں סרטים בחינם үнэгүй кино үзэх аниме үнэгүй',
  keywords: ['free movie','watch movie online','anime free','new movie 2026','watch drama','free streaming','免费看电影','免费动漫','ver películas gratis','أفلام مجانية','filmes grátis','смотреть фильмы бесплатно','film gratuit','kostenlos Filme','映画無料視聴','영화 무료 보기','फ्री मूवी देखें','ücretsiz film izle','فیلم رایگان','nonton film gratis','xem phim miễn phí','ดูหนังฟรี','filmy za darmo','үнэгүй кино үзэх'],
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  other: {
    monetag: 'e7254022db39c3b462f95c472c47b7fe',
    '1ea22d884bba68f65946ce090b81a1e7f0f8f447': '1ea22d884bba68f65946ce090b81a1e7f0f8f447',
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
      <Script id="ads-sequence" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: `
function loadScript(src, delay, attrs) {
  setTimeout(function() {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    if (attrs) { Object.keys(attrs).forEach(function(k){ s.setAttribute(k, attrs[k]); }); }
    document.head.appendChild(s);
  }, delay);
}
function loadInline(code, delay) {
  setTimeout(function() { (new Function(code))(); }, delay);
}

// 0с — Adsterra Popunder (хамгийн эхэнд, нэг л удаа)
loadScript('https://progressmagnify.com/c0/fc/a8/c0fca85dae2f795fa6a3ce8123d760eb.js', 0);

// 4с — Monetag Push Notification
loadScript('https://5gvci.com/act/files/tag.min.js?z=10860352', 4000, {'data-cfasync': 'false'});

// 8с — Adsterra Social Bar
loadScript('https://progressmagnify.com/5c/97/80/5c978000774b48cd1bcd94880d4af078.js', 8000);

// 13с — Monetag Vignette Banner
loadInline("(function(s){s.dataset.zone='10860355',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement,document.body].filter(Boolean).pop().appendChild(document.createElement('script')))", 13000);

// 23с — HilltopAds Video Slider
loadInline("(function(keclo){var d=document,s=d.createElement('script'),l=d.scripts[d.scripts.length-1];s.settings=keclo||{};s.src='//conventionalresponse.com/bjXGV/s.d/GIl/0/YeWPcE/ze/mX9vuWZaUilRkxPNTsYI5NNQDbgA0DNujvEctRN/jTk/0XOADxQ/2/N/QS';s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})", 23000);
      `}} />
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
