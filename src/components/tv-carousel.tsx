'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { type TVShow } from '@/lib/types';
import TvCard from './tv-card';

interface TvCarouselProps {
  title: string;
  items: TVShow[];
}

export default function TvCarousel({ title, items }: TvCarouselProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold mb-4 px-1">{title}</h2>
      <Carousel
        opts={{ align: 'start', slidesToScroll: 2 }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/7"
            >
              <TvCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 -translate-x-1/2" />
        <CarouselNext className="right-0 translate-x-1/2" />
      </Carousel>
    </section>
  );
}
