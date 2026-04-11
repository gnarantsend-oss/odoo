import { type Media } from '@/lib/types';
import MediaCard from './media-card';
import { NetflixRow, NetflixCard } from './netflix-row';

interface MediaCarouselProps {
  title: string;
  items: Media[];
}

export default function MediaCarousel({ title, items }: MediaCarouselProps) {
  return (
    <NetflixRow title={title} count={items.length}>
      {items.map((item, i) => (
        <NetflixCard key={item.id + '-' + i}>
          <MediaCard item={item} />
        </NetflixCard>
      ))}
    </NetflixRow>
  );
}
