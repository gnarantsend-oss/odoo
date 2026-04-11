export const runtime = 'edge';

const VAST_URL = 'https://limited-teacher.com/dtm/FbzRd.GSNUv/Z-GeUJ/LeVmM9suXZ/URlqkgPWTfYa5_N/Dtcw1hN/jdkit/Ngjkku0cNtzqU_3gMKwZ';

export async function GET() {
  try {
    const res = await fetch(VAST_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://narhantv.com',
      },
    });
    const xml = await res.text();
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });
  } catch {
    return new Response('<VAST version="3.0"/>', {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}
