import { type NextRequest, NextResponse } from 'next/server';
import { fetchFromTMDB } from '@/lib/tmdb';

// TMDB хайлт нь API key шаарддаг тул server-side route-аар дамжуулна.
// search-bar.tsx болон бусад client component-ууд энэ endpoint-г дуудна.
//
// GET /api/search?q=avatar&type=movie&limit=5
// GET /api/search?q=breaking&type=tv&limit=5

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q')?.trim();
  const type = searchParams.get('type') as 'movie' | 'tv' | null;
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '5', 10), 20);

  if (!q || q.length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  if (!type || !['movie', 'tv'].includes(type)) {
    return NextResponse.json(
      { error: 'type parameter must be "movie" or "tv"' },
      { status: 400 }
    );
  }

  const endpoint = type === 'movie' ? '/search/movie' : '/search/tv';

  const results = await fetchFromTMDB(endpoint, { query: q, page: '1' });

  return NextResponse.json(results.slice(0, limit));
}
