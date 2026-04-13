import Header from '@/components/header';
import MongolTab from '@/components/mongol-tab';

// Нүүр хуудас 5 минут тутам ISR-ээр шинэчлэгдэнэ.
// Шинэ кино нэмэгдэхэд 5 минутын дотор харагдана.
export const revalidate = 300;

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
