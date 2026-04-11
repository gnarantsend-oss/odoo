
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { type ViewerMedia } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn, slugify } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const VAST_URL = '/api/vast';
const MIDROLL_INTERVAL = 10 * 60 * 1000; // 10 минут

interface ViewerProps {
  media: ViewerMedia;
  initialItemNumber: number;
  initialSeasonNumber?: number;
  type: 'anime' | 'manga' | 'movie' | 'tv';
}

const getIframeSrc = (type: 'anime' | 'manga' | 'movie' | 'tv', mediaId: number | string, itemNumber: number, seasonNumber: number, isDub: boolean) => {
  if (type === 'anime') return `https://vidsrc.icu/embed/anime/${mediaId}/${itemNumber}/${isDub ? '1' : '0'}`;
  if (type === 'manga') return `https://vidsrc.icu/embed/manga/${mediaId}/${itemNumber}`;
  if (type === 'movie') return `https://vidsrc.icu/embed/movie/${mediaId}`;
  if (type === 'tv') return `https://vidsrc.icu/embed/tv/${mediaId}/${seasonNumber}/${itemNumber}`;
  return '';
};

function AdOverlay({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // VAST XML татаж, MediaFile URL олох
    const fetchVast = async () => {
      try {
        const res = await fetch(VAST_URL, { mode: 'cors' });
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const mediaFiles = xml.querySelectorAll('MediaFile');
        let bestUrl = '';
        // mp4, webm, ямар ч видео формат хүлээн авна
        mediaFiles.forEach((mf) => {
          const content = mf.textContent?.trim().replace(/^<!\[CDATA\[|\]\]>$/g, '').trim() || '';
          if (content.startsWith('http') && !bestUrl) bestUrl = content;
          // mp4 олдвол давуу эрх өгнө
          const type = mf.getAttribute('type') || '';
          if (type.includes('mp4') && content.startsWith('http')) bestUrl = content;
        });
        if (!bestUrl) {
          const match = text.match(/https?:\/\/[^\s<"\]]+\.(mp4|webm|ogg)[^\s<"\]]*/i);
          if (match) bestUrl = match[0];
        }
        if (bestUrl) {
          setVideoUrl(bestUrl);
        } else {
          setFailed(true);
          onComplete();
        }
      } catch {
        setFailed(true);
        onComplete();
      }
    };
    fetchVast();
  }, [onComplete]);

  useEffect(() => {
    if (!videoUrl) return;
    const timer = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) { clearInterval(timer); setCanSkip(true); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [videoUrl]);

  if (failed) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
      {!videoUrl ? (
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          playsInline
          className="w-full h-full object-contain"
          onEnded={onComplete}
          onError={onComplete}
        />
      )}
      <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Реклам
      </div>
      {videoUrl && (
        <div className="absolute bottom-4 right-4">
          {canSkip ? (
            <button
              onClick={onComplete}
              className="bg-white/90 text-black text-sm font-semibold px-4 py-2 rounded hover:bg-white transition"
            >
              Алгасах →
            </button>
          ) : (
            <div className="bg-black/70 text-white text-sm px-3 py-1 rounded">
              {countdown}с дараа алгасна
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Viewer({ media, initialItemNumber, initialSeasonNumber = 1, type }: ViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [itemNumber, setItemNumber] = useState(initialItemNumber);
  const [seasonNumber, setSeasonNumber] = useState(initialSeasonNumber);
  const [isDub, setIsDub] = useState(searchParams.get('dub') === '1');
  const [showAd, setShowAd] = useState(type !== 'manga');

  const mediaId = media.imdb_id || media.id;
  const [iframeSrc, setIframeSrc] = useState(() => getIframeSrc(type, mediaId, initialItemNumber, initialSeasonNumber, isDub));
  const [isLoading, setIsLoading] = useState(true);

  const title = media.title.english || media.title.romaji;
  const isAnime = type === 'anime';
  const isManga = type === 'manga';
  const isMovie = type === 'movie';
  const isTv = type === 'tv';
  const totalItems = isAnime ? media.episodes : (isTv ? (media.seasons?.find(s => s.season_number === seasonNumber)?.episode_count) : media.chapters);

  // Mid-roll: 10 минутын дараа
  useEffect(() => {
    if (showAd || isManga) return;
    const t = setTimeout(() => setShowAd(true), MIDROLL_INTERVAL);
    return () => clearTimeout(t);
  }, [showAd, isManga, itemNumber]);

  useEffect(() => {
    setIsLoading(true);
    const newSrc = getIframeSrc(type, mediaId, itemNumber, seasonNumber, isDub);
    setIframeSrc(newSrc);
    const slug = slugify(title);
    let newUrl = `/view/${type}/${media.id}-${slug}`;
    const params = new URLSearchParams();
    if (isTv) { params.set('season', seasonNumber.toString()); params.set('episode', itemNumber.toString()); }
    else if (isAnime) params.set('item', itemNumber.toString());
    else if (isManga) params.set('item', itemNumber.toString());
    if (isAnime && isDub) params.set('dub', '1');
    const paramsString = params.toString();
    if (paramsString) newUrl += `?${paramsString}`;
    window.history.pushState(null, '', newUrl);
  }, [itemNumber, seasonNumber, isDub, media.id, mediaId, type, title, isAnime, isManga, isTv]);

  const handleNavigation = (newItemNumber: number) => {
    if (newItemNumber < 1) { toast({ title: "You're at the beginning!", description: "This is the first item." }); return; }
    if (totalItems && newItemNumber > totalItems) { toast({ title: "You've reached the end!", description: "This is the last available item." }); return; }
    setShowAd(true); // Episod солигдоход pre-roll
    setItemNumber(newItemNumber);
  };

  const handleSeasonChange = (season: number) => { setSeasonNumber(season); setItemNumber(1); };
  const backLink = isMovie ? `/media/movie/${media.id}-${slugify(title)}` : isTv ? `/media/tv/${media.id}-${slugify(title)}` : `/media/${type}/${media.id}-${slugify(title)}`;
  const itemLabel = isAnime || isTv ? 'Episode' : 'Chapter';

  return (
    <>
      <div className={cn("flex h-screen flex-col text-foreground", isManga ? 'bg-stone-100 dark:bg-stone-900' : 'bg-background')}>
        <header className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-hidden">
            <Link href={backLink} passHref>
              <Button variant="outline" size="icon" aria-label="Go back to details" className={isManga ? 'bg-white dark:bg-stone-800' : ''}>
                <ArrowLeft />
              </Button>
            </Link>
            <div className="flex flex-col overflow-hidden">
              <h1 className="truncate text-lg font-semibold">{title}</h1>
              {!isMovie && <span className="text-sm text-muted-foreground">{isTv && `Season ${seasonNumber} • `}{itemLabel} {itemNumber}</span>}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {(isTv && media.seasons && media.seasons.length > 1) && (
              <Select onValueChange={(value) => handleSeasonChange(parseInt(value))} defaultValue={seasonNumber.toString()}>
                <SelectTrigger className={cn("w-[150px]", isManga ? 'bg-white dark:bg-stone-800' : '')}>
                  <SelectValue placeholder="Select a season" />
                </SelectTrigger>
                <SelectContent>
                  {media.seasons.filter(s => s.season_number > 0).map((season) => (
                    <SelectItem key={season.id} value={season.season_number.toString()}>Season {season.season_number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {isAnime && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="dub-toggle" className={isManga ? 'text-foreground' : ''}>Dub</Label>
                <Switch id="dub-toggle" checked={isDub} onCheckedChange={setIsDub} />
              </div>
            )}
          </div>
        </header>

        <main className={cn('relative flex flex-1 items-center justify-center overflow-hidden', isManga ? '' : 'bg-black')}>
          {showAd && (
            <AdOverlay onComplete={() => setShowAd(false)} />
          )}
          {isLoading && !showAd && (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {iframeSrc && (
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              onLoad={() => setIsLoading(false)}
              allowFullScreen
              className={cn('h-full w-full border-0', (isLoading || showAd) ? 'hidden' : 'block', isManga ? 'max-w-4xl' : '')}
              title={`Viewer for ${title}`}
            />
          )}
        </main>

        {!isMovie && (
          <footer className="container mx-auto flex items-center justify-between p-4">
            <Button onClick={() => handleNavigation(itemNumber - 1)} disabled={itemNumber <= 1} variant="secondary" className={isManga ? 'bg-white dark:bg-stone-800' : ''}>
              <ChevronLeft className="mr-2" />Previous
            </Button>
            <Button onClick={() => handleNavigation(itemNumber + 1)} disabled={!!(totalItems && itemNumber >= totalItems)} variant="secondary" className={isManga ? 'bg-white dark:bg-stone-800' : ''}>
              Next<ChevronRight className="ml-2" />
            </Button>
          </footer>
        )}
      </div>
    </>
  );
}
