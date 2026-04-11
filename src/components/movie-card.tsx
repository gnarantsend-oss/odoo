import Image from 'next/image';
import Link from 'next/link';
import { type Movie } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { Play, Star } from 'lucide-react';

interface MovieCardProps {
  item: Movie;
}

export default function MovieCard({ item }: MovieCardProps) {
  const title = item.title || item.original_title;
  const movieUrl = `/media/movie/${item.id}-${slugify(title)}`;
  const imgSrc = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  return (
    <Link href={movieUrl} className="group relative block w-full cursor-pointer">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md
                      ring-0 group-hover:ring-2 ring-primary/60
                      transition-all duration-300 ease-out
                      group-hover:scale-[1.03] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
        <div className="absolute inset-0 bg-muted skeleton" />
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 14vw"
            unoptimized
          />
        )}

        {rating && (
          <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-0.5
                          bg-black/70 backdrop-blur-sm text-yellow-400
                          px-1.5 py-0.5 rounded text-[10px] font-bold">
            <Star className="w-2.5 h-2.5 fill-yellow-400" />
            {rating}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-all duration-300
                        scale-90 group-hover:scale-100">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/80
                          flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2.5
                        translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                        transition-all duration-300">
          <p className="text-white text-xs font-semibold truncate leading-tight drop-shadow">{title}</p>
          {item.release_date && (
            <p className="text-white/50 text-[10px] mt-0.5">{item.release_date.slice(0, 4)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
