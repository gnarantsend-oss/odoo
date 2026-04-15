import Header from '@/components/header';
import MongolTab from '@/components/mongol-tab';
import { getMongolMoviesFromBunny } from '@/lib/bunny';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export default async function Home() {
  const movies = await getMongolMoviesFromBunny();
  return (
    <div style={{ minHeight: '100vh', background: '#0b0e1a' }}>
      <Header />
      <main style={{ paddingTop: '62px' }}>
        <MongolTab movies={movies} />
      </main>
    </div>
  );
}
