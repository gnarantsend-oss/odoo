import Header from '@/components/header';
import MongolTab from '@/components/mongol-tab';

export const revalidate = 300;

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0b0e1a' }}>
      <Header />
      <main style={{ paddingTop: '62px' }}>
        <MongolTab />
      </main>
    </div>
  );
}
