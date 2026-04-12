import { fetchFromAniList } from '@/lib/anilist';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get('type') || 'ANIME') as 'ANIME' | 'MANGA';
  const sort = searchParams.get('sort') || 'TRENDING_DESC';
  const perPage = Number(searchParams.get('perPage') || '20');
  const search = searchParams.get('search') || undefined;

  try {
    const results = await fetchFromAniList({
      type,
      sort: [sort as any],
      perPage,
      search,
    });
    return NextResponse.json(results);
  } catch (error) {
    console.error('AniList API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
