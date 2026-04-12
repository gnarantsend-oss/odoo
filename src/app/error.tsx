'use client';

import type { ErrorInfo } from 'next/error';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// Next.js 16.2-ын шинэ unstable_retry() — router.refresh() + reset() хоёуланг
// нэгэн зэрэг дуудаж data re-fetch хийдэг. Зөвхөн reset() дуудах хуучин аргаас
// ялгаатай нь серверийн өгөгдлийг дахин ачаалдаг.
export default function Error({ error, unstable_retry }: ErrorInfo) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Алдаа гарлаа</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {error.message || 'Өгөгдөл ачаалахад алдаа гарлаа. Дахин оролдоно уу.'}
        </p>
      </div>

      <Button
        onClick={() => unstable_retry?.()}
        variant="outline"
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Дахин оролдох
      </Button>
    </div>
  );
}
