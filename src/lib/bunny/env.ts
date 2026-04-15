export function getBunnyLibraryId(): string {
  return process.env.BUNNY_LIBRARY_ID || '12345';
}

export function getBunnyApiKey(): string | undefined {
  return process.env.BUNNY_STREAM_API_KEY;
}

export function getBunnyCdnHostname(libraryId: string): string {
  return process.env.BUNNY_CDN_HOSTNAME || `vz-${libraryId}.b-cdn.net`;
}

