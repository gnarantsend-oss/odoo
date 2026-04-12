'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from './ui/scroll-area';

export default function DisclaimerModal() {
  // ✅ undefined = мэдэхгүй (hydrate болоогүй), false = зөвшөөрсөн, true = харуулах
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const hasAgreed = localStorage.getItem('hasAgreedToDisclaimer');
    setIsOpen(hasAgreed !== 'true');
  }, []);

  const handleAgree = () => {
    localStorage.setItem('hasAgreedToDisclaimer', 'true');
    setIsOpen(false);
  };

  // undefined үед render хийхгүй — hydration flash байхгүй
  if (isOpen === undefined) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="p-0 w-[90vw] max-w-md rounded-lg">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Narhan TV — Disclaimer</AlertDialogTitle>
          </AlertDialogHeader>
        </div>

        <ScrollArea className="max-h-[50vh] px-6">
          <div className="space-y-4 text-sm text-muted-foreground text-left">
            <p className="font-semibold text-white/80">
              By using Narhan TV, you acknowledge and agree to these terms. This platform is strictly
              non-commercial and intended only for personal exploration and learning.
            </p>
            <hr className="my-4 border-t border-transparent" />
            <p>
              Narhan TV does not host, store, or upload any media files on its servers. All titles,
              images, and metadata are fetched from publicly available third-party APIs such as TMDB
              and AniList.
            </p>
            <p>
              Streaming links and embeds are provided by external sources. Narhan TV has no ownership
              or administrative control over such external content. If you believe any content violates
              copyright, please contact the respective hosting provider directly.
            </p>
          </div>
        </ScrollArea>

        <AlertDialogFooter className="border-t p-4">
          <Button onClick={handleAgree} className="w-full">
            Зөвшөөрч үргэлжлүүлэх
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
