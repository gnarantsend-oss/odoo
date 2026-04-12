import Header from '@/components/header';
import MongolTab from '@/components/mongol-tab';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <MongolTab />
      </main>
    </div>
  );
}
