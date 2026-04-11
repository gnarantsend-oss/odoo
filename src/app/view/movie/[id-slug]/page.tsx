export const runtime = 'edge';

import { notFound } from 'next/navigation';
import { fetchMovieById, getTMDBImageUrl } from '@/lib/tmdb';
import type { Metadata, ResolvingMetadata } from 'next';
import { slugify } from '@/lib/utils';
import Viewer from '@/components/viewer';
import { type ViewerMedia } from '@/lib/types';

type Props = {
  params: Promise<{ 'id-slug': string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { 'id-slug': idSlug } = await params;
  const id = parseInt(idSlug.split('-')[0]);

  if (isNaN(id)) return { title: 'Not Found' };

  const movie = await fetchMovieById(id);
  if (!movie) return { title: 'Not Found' };

  const parentOG = (await parent).openGraph || {};
  const safeParentOG = Object.fromEntries(
    Object.entries(parentOG).map(([k, v]) => [k, v === null ? undefined : v])
  );

  return {
    title: `Watch ${movie.title}`,
    description: `Stream the movie ${movie.title} in high quality.`,
    openGraph: {
      ...safeParentOG,
      title: `Watch ${movie.title}`,
      description: `Stream the movie ${movie.title} in high quality.`,
      type: 'video.movie',
    },
  };
}

export default async function ViewPage({ params }: Props) {
  const { 'id-slug': idSlug } = await params;
  const id = parseInt(idSlug.split('-')[0], 10);

  if (isNaN(id)) notFound();

  const movie = await fetchMovieById(id);
  if (!movie) notFound();

  // TMDB poster_path нь '/abc.jpg' гэсэн хэсэгчилсэн зам —
  // getTMDBImageUrl ашиглан бүтэн URL болгоно
  const viewerMedia: ViewerMedia = {
    id: movie.id,
    imdb_id: movie.imdb_id,
    title: { english: movie.title, romaji: movie.original_title },
    type: 'ANIME',
    episodes: 1,
    chapters: null,
    description: movie.overview,
    coverImage: {
      extraLarge: getTMDBImageUrl(movie.poster_path, 'original') || '',
      large: getTMDBImageUrl(movie.poster_path, 'w500') || '',
    },
    bannerImage: getTMDBImageUrl(movie.backdrop_path, 'original'),
    startDate: movie.release_date
      ? {
          year: new Date(movie.release_date).getFullYear(),
          month: new Date(movie.release_date).getMonth() + 1,
          day: new Date(movie.release_date).getDate(),
        }
      : null,
  };

  return <Viewer media={viewerMedia} initialItemNumber={1} type="movie" />;
}
