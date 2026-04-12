import { notFound } from 'next/navigation';
import { fetchMediaById } from '@/lib/anilist';
import type { Metadata } from 'next';
import JsonLd from '@/components/json-ld';
import Viewer from '@/components/viewer';

type Props = {
  params: Promise<{ 'id-slug': string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { 'id-slug': idSlug } = await params;
  const sp = await searchParams;
  const id = parseInt(idSlug.split('-')[0]);
  if (isNaN(id)) return { title: 'Not Found' };
  const media = await fetchMediaById(id);
  if (!media) return { title: 'Not Found' };
  const title = media.title.english || media.title.romaji;
  const itemNumber = sp?.item || '1';
  return {
    title: `Read ${title} Chapter ${itemNumber}`,
    description: `Read chapter ${String(itemNumber)} of ${title}.`,
    openGraph: {
      title: `Read ${title} Chapter ${itemNumber}`,
      images: [media.coverImage.extraLarge].filter(Boolean) as string[],
      type: 'article',
    },
  };
}

export default async function ViewMangaPage({ params, searchParams }: Props) {
  const { 'id-slug': idSlug } = await params;
  const sp = await searchParams;
  const id = parseInt(idSlug.split('-')[0], 10);
  const itemNumberParam = sp?.item;
  const initialItemNumber = Array.isArray(itemNumberParam)
    ? parseInt(itemNumberParam[0], 10)
    : parseInt((itemNumberParam as string | undefined) || '1', 10);

  if (isNaN(id) || isNaN(initialItemNumber)) notFound();

  const media = await fetchMediaById(id);
  if (!media) notFound();

  return (
    <>
      <JsonLd media={media} type="manga" itemNumber={initialItemNumber} />
      <Viewer media={media} initialItemNumber={initialItemNumber} type="manga" />
    </>
  );
}
