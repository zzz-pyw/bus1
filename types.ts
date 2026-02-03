export interface Movie {
  id: string; // The specific movie ID (e.g., ABC-123)
  date: string;
  title: string;
  img: string; // URL to cover image
  tags?: string[];
}

export interface MovieDetail extends Movie {
  gid?: string;
  uc?: string;
  director?: string;
  studio?: string;
  label?: string;
  actors?: Array<{
    name: string;
    url?: string;
    img?: string;
  }>;
  screencaps?: string[];
}

export interface Magnet {
  id: string;
  link: string;
  name: string;
  size: string;
  date: string;
}

export interface PaginationResponse {
  movies: Movie[];
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export type CategoryType = 'normal' | 'uncensored' | 'search' | 'star';
