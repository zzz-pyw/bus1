
export interface Movie {
  id: string;
  date: string;
  title: string;
  img: string;
  tags?: string[];
  hasMagnet?: boolean; // 新增标记：是否有磁力链接
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
    id?: string;
  }>;
  screencaps?: string[];
  genre?: string[];
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

export type CategoryType = 'normal' | 'uncensored' | 'search' | 'star' | 'genre';
