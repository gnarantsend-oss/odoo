
export type Media = {
  id: number;
  imdb_id?: string;
  type: 'ANIME' | 'MANGA';
  format?: string;
  status?: string;
  title: {
    romaji: string;
    english: string | null;
  };
  coverImage: {
    extraLarge: string;
    large: string;
  };
  bannerImage: string | null;
  episodes: number | null;
  chapters: number | null;
  description: string;
  startDate: {
    year: number;
    month: number;
    day: number;
  } | null;
  genres: string[];
  relations?: {
    edges: {
      relationType: 'SEQUEL' | 'PREQUEL' | 'PARENT' | 'SIDE_STORY' | 'SPIN_OFF' | 'ALTERNATIVE';
      node: Media;
    }[];
  };
  seasons?: Season[];
};

export type AniListPage = {
  media: Media[];
};

export type AniListResponse = {
  data: {
    Page: AniListPage;
  };
};

export type AniListMediaResponse = {
  data: {
    Media: Media;
  };
};

// Types for The Movie Database (TMDB)
export type Genre = {
  id: number;
  name: string;
}

export type Movie = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  imdb_id?: string;
  bunny_thumbnail?: string | null;  // Bunny Stream custom poster (хэрэв байвал TMDB-с давна)
  bunny_iframe_src?: string | null; // Bunny Stream iframe URL
  preview_url?: string | null;      // Bunny Stream preview.webp (hover дээр тоглоно)
};

export type Season = {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export type TVShow = {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  imdb_id?: string;
  number_of_episodes?: number;
  number_of_seasons?: number;
  seasons?: Season[];
};

export type TMDBResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

// Viewer компонентэд дамжуулдаг нэгдсэн media төрөл.
// Media (AniList), Movie, TVShow бүгд энд нийцнэ.
export type ViewerMedia = {
  id: number;
  imdb_id?: string;
  title: { english: string | null; romaji: string };
  type: 'ANIME' | 'MANGA';
  episodes: number | null;
  chapters: number | null;
  description: string;
  coverImage: { extraLarge: string; large: string };
  bannerImage: string | null;
  startDate: { year: number; month: number; day: number } | null;
  seasons?: Season[];
};
