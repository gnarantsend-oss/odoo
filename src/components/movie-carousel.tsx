import { type Movie } from '@/lib/types';
import MovieCard from './movie-card';
import { NetflixRow, NetflixCard } from './netflix-row';

interface MovieCarouselProps {
  title: string;
  items: Movie[];
}

export default function MovieCarousel({ title, items }: MovieCarouselProps) {
  return (
    <NetflixRow title={title} count={items.length}>
      {items.map((item, i) => (
        <NetflixCard key={item.id + '-' + i}>
          <MovieCard item={item} />
        </NetflixCard>
      ))}
    </NetflixRow>
  );
}
