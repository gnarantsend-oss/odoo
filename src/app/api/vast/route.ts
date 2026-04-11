export const runtime = 'edge';

export async function GET() {
  return new Response('<VAST version="3.0"/>', {
    headers: { 'Content-Type': 'application/xml' },
  });
}
