import { notFound } from 'next/navigation';
import { fetchTVShowById, getTMDBImageUrl } from '@/lib/tmdb';
import type { Metadata, ResolvingMetadata } from 'next';
import { slugify } from '@/lib/utils';
import Viewer from '@/components/viewer';
import { type ViewerMedia } from '@/lib/types';

type Props = {
  params: Promise<{ 'id-slug': string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { 'id-slug': idSlug } = await params;
  const sp = await searchParams;
  const id = parseInt(idSlug.split('-')[0]);

  if (isNaN(id)) return { title: 'Not Found' };

  const show = await fetchTVShowById(id);
  if (!show) return { title: 'Not Found' };

  const season = sp?.season || '1';
  const episode = sp?.episode || '1';

  const parentOG = (await parent).openGraph || {};
  const safeParentOG = Object.fromEntries(
    Object.entries(parentOG).map(([k, v]) => [k, v === null ? undefined : v])
  );

  return {
    title: `Watch ${show.name} S${season} E${episode}`,
    description: `Stream season ${season} episode ${episode} of ${show.name} in high quality.`,
    openGraph: {
      ...safeParentOG,
      title: `Watch ${show.name} S${season} E${episode}`,
      description: `Stream season ${season} episode ${episode} of ${show.name} in high quality.`,
      type: 'video.episode',
    },
  };
}

export default async function ViewPage({ params, searchParams }: Props) {
  const { 'id-slug': idSlug } = await params;
  const sp = await searchParams;
  const id = parseInt(idSlug.split('-')[0], 10);

  if (isNaN(id)) notFound();

  const show = await fetchTVShowById(id);
  if (!show) notFound();

  const seasonParam = sp?.season;
  const episodeParam = sp?.episode;
  const season = parseInt(
    Array.isArray(seasonParam) ? seasonParam[0] : (seasonParam as string | undefined) || '1',
    10
  );
  const episode = parseInt(
    Array.isArray(episodeParam) ? episodeParam[0] : (episodeParam as string | undefined) || '1',
    10
  );

  // TMDB poster_path нь '/abc.jpg' гэсэн хэсэгчилсэн зам —
  // getTMDBImageUrl ашиглан бүтэн URL болгоно
  const viewerMedia: ViewerMedia = {
    id: show.id,
    imdb_id: show.imdb_id,
    title: { english: show.name, romaji: show.original_name },
    type: 'TV',
    episodes: show.number_of_episodes || null,
    chapters: null,
    description: show.overview,
    coverImage: {
      extraLarge: getTMDBImageUrl(show.poster_path, 'original') || '',
      large: getTMDBImageUrl(show.poster_path, 'w500') || '',
    },
    bannerImage: getTMDBImageUrl(show.backdrop_path, 'original'),
    startDate: show.first_air_date
      ? {
          year: new Date(show.first_air_date).getFullYear(),
          month: new Date(show.first_air_date).getMonth() + 1,
          day: new Date(show.first_air_date).getDate(),
        }
      : null,
    seasons: show.seasons,
  };

  return (
    <Viewer
      media={viewerMedia}
      initialItemNumber={episode}
      initialSeasonNumber={season}
      type="tv"
    />
  );
}
