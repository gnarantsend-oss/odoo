'use client';

import { useEffect } from 'react';
import Header from '@/components/header';
import Image from 'next/image';
import { PlayCircle, Star, Clock, Calendar } from 'lucide-react';

const SMARTLINK = 'https://progressmagnify.com/kb06gx6fqy?key=5de40f0f2fb290453196572a5df548df';

const DRAMAS = [
  {
    id: 1,
    title: 'Queen of Tears',
    year: 2024,
    episodes: 16,
    rating: 9.0,
    genre: 'Романтик / Драм',
    poster: 'https://image.tmdb.org/t/p/w500/tqnHKSRLJzfYiWf5bZFWNrMFBIN.jpg',
    desc: 'Баян гэр бүлийн охин болон энгийн залуугийн хайрын тухай өгүүлэх K-Drama.',
  },
  {
    id: 2,
    title: 'Crash Landing on You',
    year: 2019,
    episodes: 16,
    rating: 8.7,
    genre: 'Романтик / Комеди',
    poster: 'https://image.tmdb.org/t/p/w500/3kcPN0HwbLhLqf9YhMBvfzn90YD.jpg',
    desc: 'Өмнөд Солонгосын охин Хойд Солонгост осолтой буудаллан хайрт хүнтэйгээ уулзана.',
  },
  {
    id: 3,
    title: 'Goblin',
    year: 2016,
    episodes: 16,
    rating: 8.8,
    genre: 'Фэнтэзи / Романтик',
    poster: 'https://image.tmdb.org/t/p/w500/gjNChhr2BLuZ6RNhBGYuqv2GVra.jpg',
    desc: '939 жил амьдарсан чөтгөр өөрийн хийрэлт байдлаасаа ангижрах арга замыг хайна.',
  },
  {
    id: 4,
    title: 'My Love from the Star',
    year: 2013,
    episodes: 21,
    rating: 8.5,
    genre: 'Фэнтэзи / Романтик',
    poster: 'https://image.tmdb.org/t/p/w500/bSRHbEaRjCdH7jOBKDRHEZ0WNNY.jpg',
    desc: '400 жилийн өмнө дэлхийд ирсэн гаригийн оршин суугч алдартай жүжигчнийг хайрлана.',
  },
  {
    id: 5,
    title: 'Itaewon Class',
    year: 2020,
    episodes: 16,
    rating: 8.4,
    genre: 'Драм / Романтик',
    poster: 'https://image.tmdb.org/t/p/w500/m8KNQWRGzMjKb4cWTb2oRmFBcWQ.jpg',
    desc: 'Залуу хүн эцгийнхээ үхлийн өшөөг авахаар ресторан нээж амжилтын замд гарна.',
  },
  {
    id: 6,
    title: 'Vincenzo',
    year: 2021,
    episodes: 20,
    rating: 8.9,
    genre: 'Хар инээд / Гэмт хэрэг',
    poster: 'https://image.tmdb.org/t/p/w500/sd2TFm5L6ZmGhqFpfMp5Hj8A11N.jpg',
    desc: 'Итали мафийн хуульч Солонгост буцаж ирэн хорон муу корпорацитай тэмцэнэ.',
  },
  {
    id: 7,
    title: 'Squid Game',
    year: 2021,
    episodes: 9,
    rating: 8.0,
    genre: 'Thriller / Драм',
    poster: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
    desc: 'Өрийн дарамтанд дарагдсан хүмүүс амиа барьж 45.6 тэрбум вон авахаар тоглоомд орно.',
  },
  {
    id: 8,
    title: 'Descendants of the Sun',
    year: 2016,
    episodes: 16,
    rating: 8.3,
    genre: 'Романтик / Экшн',
    poster: 'https://image.tmdb.org/t/p/w500/4kAXzCBqNnBHHqB5TW0lWbEeKdZ.jpg',
    desc: 'Цэргийн офицер болон эмч хоёрын хоорондох найдваргүй хайрын тухай өгүүлнэ.',
  },
];

function DramaCard({ drama }: { drama: typeof DRAMAS[0] }) {
  const handleClick = () => {
    window.open(SMARTLINK, '_blank');
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer rounded-lg overflow-hidden bg-card border border-border/40 hover:border-primary/50 transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={drama.poster}
          alt={drama.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
        </div>
        <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400" />
          {drama.rating}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
          {drama.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 mb-2">{drama.genre}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{drama.year}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{drama.episodes} анги</span>
        </div>
      </div>
    </div>
  );
}

export default function KDramaPage() {
  useEffect(() => {
    document.title = 'K-Drama | Narhan TV';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">🇰🇷 K-Drama</h1>
          <p className="text-muted-foreground">Солонгосын шилдэг цувралуудыг үнэгүй үзнэ үү</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {DRAMAS.map((drama) => (
            <DramaCard key={drama.id} drama={drama} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">Илүү олон K-Drama үзэхийг хүсвэл...</p>
          <button
            onClick={() => window.open(SMARTLINK, '_blank')}
            className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Бүгдийг үзэх →
          </button>
        </div>
      </main>
    </div>
  );
}
