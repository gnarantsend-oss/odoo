export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Narhan TV] Server instrumentation registered');
  }
}

export function onRequestError(
  err: { digest?: string } & Error,
  request: {
    path: string;
    method: string;
    headers: Record<string, string>;
  },
) {
  const isExpected =
    err.digest === 'NEXT_NOT_FOUND' ||
    err.digest === 'NEXT_REDIRECT';

  if (!isExpected) {
    console.error(
      `[Narhan TV Error] ${request.method} ${request.path} →`,
      err.message,
      err.digest ?? '',
    );
  }
}
