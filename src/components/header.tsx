import Link from 'next/link';
import { MZtvLogo } from '@/components/icons';
import { ThemeSwitcher } from './theme-switcher';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-2 flex items-center space-x-2 md:mr-6">
            <MZtvLogo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">Narhan TV</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
