// Mongol content types
export type MongolMovie = {
  id: string;
  title: string;
  description?: string;
  poster?: string;
  year?: number;
  genres?: string[];
};
