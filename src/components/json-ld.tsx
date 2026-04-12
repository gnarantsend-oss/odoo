import { type Media } from '@/lib/types';

interface JsonLdProps {
  media: Media;
  type: 'anime' | 'manga';
  itemNumber: number;
}

export default function JsonLd({ media, type, itemNumber }: JsonLdProps) {
  const title = media.title.english || media.title.romaji;

  const jsonLd =
    type === 'anime'
      ? {
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: `${title} Episode ${itemNumber}`,
          description: media.description ?? undefined,
          thumbnailUrl: media.coverImage.extraLarge,
          uploadDate: media.startDate
            ? `${media.startDate.year}-${String(media.startDate.month).padStart(2, '0')}-${String(media.startDate.day).padStart(2, '0')}`
            : undefined,
          genre: media.genres,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: `${title} Chapter ${itemNumber}`,
          description: media.description ?? undefined,
          image: media.coverImage.extraLarge,
          genre: media.genres,
          datePublished: media.startDate
            ? `${media.startDate.year}-${String(media.startDate.month).padStart(2, '0')}-${String(media.startDate.day).padStart(2, '0')}`
            : undefined,
        };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
