'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { type Movie } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { Play, Plus, Info } from 'lucide-react';
import { getTMDBImageUrl } from '@/lib/tmdb-image';

export default function MovieHeroCarousel({ items }: { items: Movie[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="w-full relative -mb-12 sm:-mb-16 md:-mb-24">
      <Carousel className="w-full" opts={{ loop: true }}
        plugins={[Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })]}>
        <CarouselContent>
          {items.map((item) => <CarouselItem key={item.id}><HeroSlide item={item} /></CarouselItem>)}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

function HeroSlide({ item }: { item: Movie }) {
  const title     = item.title || item.original_title;
  const mediaUrl  = `/media/movie/${item.id}-${slugify(title)}`;
  const watchUrl  = `/view/movie/${item.id}-${slugify(title)}`;
  const bannerUrl = getTMDBImageUrl(item.backdrop_path, 'original');
  const posterUrl = getTMDBImageUrl(item.poster_path, 'w500');
  const year      = item.release_date?.slice(0, 4);
  const rating    = item.vote_average ? item.vote_average.toFixed(1) : null;
  const genres    = (item as any).genres?.slice(0, 3).map((g: any) => g.name) ?? [];

  return (
    <div className="relative w-full overflow-hidden text-white"
         style={{ height: 'clamp(520px, 72vh, 780px)' }}>

      {bannerUrl && (
        <Image src={bannerUrl} alt={title} fill
          className="object-cover object-top"
          style={{ animation: 'heroZoom 8s ease-out forwards' }}
          priority unoptimized />
      )}

      {/* Mobile: poster дүүрэн */}
      {posterUrl && (
        <div className="absolute inset-0 md:hidden">
          <Image src={posterUrl} alt={title} fill
            className="object-cover object-center" priority unoptimized />
        </div>
      )}

      <div className="absolute inset-0 z-10"
           style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)' }} />
      <div className="absolute inset-0 z-10 hidden md:block"
           style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)' }} />

      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-16 md:pb-28 md:px-10 lg:px-16">
        <div className="mb-2 flex items-center gap-2">
          <span style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em',
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
            padding: '2px 8px', borderRadius: '4px', border: '0.5px solid rgba(255,255,255,0.2)',
          }}>FILM</span>
          {year && (
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{year}</span>
          )}
          {rating && (
            <span style={{ fontSize: '11px', color: 'rgba(255,220,50,0.85)', fontWeight: 600 }}>
              ★ {rating}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: 'clamp(26px, 6vw, 52px)', fontWeight: 800, lineHeight: 1.1,
                      letterSpacing: '-0.01em', textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                      marginBottom: '8px' }}
            className="line-clamp-2">{title}</h1>

        {genres.length > 0 && (
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.60)',
                       marginBottom: '14px', letterSpacing: '0.01em' }}>
            {genres.join(' · ')}
          </p>
        )}

        {item.overview && (
          <p className="hidden md:block line-clamp-2"
             style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)',
                      maxWidth: '480px', marginBottom: '18px', lineHeight: 1.5 }}>
            {item.overview}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Link href={mediaUrl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', minWidth: '48px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%',
                           background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
                           display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
              <Plus size={18} />
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>My List</span>
          </Link>

          <Link href={watchUrl}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
                           background: 'white', color: 'black',
                           padding: '10px 24px', borderRadius: '4px',
                           fontWeight: 700, fontSize: '15px',
                           boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              <Play size={18} fill="black" />
              Тоглуулах
            </div>
          </Link>

          <Link href={mediaUrl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', minWidth: '48px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%',
                           background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
                           display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
              <Info size={18} />
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Info</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
