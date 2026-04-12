'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { type Movie } from '@/lib/types';
import MovieCard from './movie-card';

interface MovieCarouselProps {
  title: string;
  items: Movie[];
}

export default function MovieCarousel({ title, items }: MovieCarouselProps) {
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
              <MovieCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 -translate-x-1/2" />
        <CarouselNext className="right-0 translate-x-1/2" />
      </Carousel>
    </section>
  );
}
