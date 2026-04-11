import Image from 'next/image';
import Link from 'next/link';
import { type Media } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { Play } from 'lucide-react';

interface MediaCardProps {
  item: Media;
}

export default function MediaCard({ item }: MediaCardProps) {
  const title = item.title.english || item.title.romaji;
  const mediaUrl = `/media/${item.type.toLowerCase()}/${item.id}-${slugify(title)}`;
  const genre = item.genres?.[0];

  return (
    <Link href={mediaUrl} className="group relative block w-full cursor-pointer">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md
                      ring-0 group-hover:ring-2 ring-primary/60
                      transition-all duration-300 ease-out
                      group-hover:scale-[1.03] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
        {/* Skeleton placeholder */}
        <div className="absolute inset-0 bg-muted skeleton" />

        {item.coverImage.large && (
          <Image
            src={item.coverImage.large}
            alt={title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 14vw"
            unoptimized
          />
        )}

        {/* Genre badge */}
        {genre && (
          <div className="absolute top-1.5 left-1.5 z-10
                          bg-black/70 backdrop-blur-sm text-white/80
                          px-1.5 py-0.5 rounded text-[10px] font-medium truncate max-w-[70%]">
            {genre}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-all duration-300
                        scale-90 group-hover:scale-100">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/80
                          flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5
                        translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                        transition-all duration-300">
          <p className="text-white text-xs font-semibold truncate leading-tight drop-shadow">{title}</p>
          {item.startDate?.year && (
            <p className="text-white/50 text-[10px] mt-0.5">{item.startDate.year}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
