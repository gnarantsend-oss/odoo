import { type TVShow } from '@/lib/types';
import TvCard from './tv-card';
import { NetflixRow, NetflixCard } from './netflix-row';

interface TvCarouselProps {
  title: string;
  items: TVShow[];
}

export default function TvCarousel({ title, items }: TvCarouselProps) {
  return (
    <NetflixRow title={title} count={items.length}>
      {items.map((item, i) => (
        <NetflixCard key={item.id + '-' + i}>
          <TvCard item={item} />
        </NetflixCard>
      ))}
    </NetflixRow>
  );
}
