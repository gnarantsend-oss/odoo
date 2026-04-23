import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const hasApiKey = !!process.env.BUNNY_STREAM_API_KEY;
  const libraryId = process.env.BUNNY_LIBRARY_ID || '12345';
  const hasLibraryId = !!process.env.BUNNY_LIBRARY_ID;
  const cdnHost = process.env.BUNNY_CDN_HOSTNAME || `vz-${libraryId}.b-cdn.net`;
  const hasCdnHost = !!process.env.BUNNY_CDN_HOSTNAME;

  if (!hasApiKey) {
    return NextResponse.json({
      ok: false,
      hasApiKey,
      hasLibraryId,
      hasCdnHost,
      libraryId,
      cdnHost,
      note: 'Missing BUNNY_STREAM_API_KEY',
    });
  }

  try {
    const url = `https://video.bunnycdn.com/library/${libraryId}/videos?page=1&itemsPerPage=1&orderBy=date`;
    const res = await fetch(url, { headers: { AccessKey: process.env.BUNNY_STREAM_API_KEY as string } });

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      hasApiKey,
      hasLibraryId,
      hasCdnHost,
      libraryId,
      cdnHost,
      hint: !hasLibraryId ? 'BUNNY_LIBRARY_ID тохируулаагүй' : undefined,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      hasApiKey,
      hasLibraryId,
      hasCdnHost,
      libraryId,
      cdnHost,
      error: String(err),
    });
  }
}
