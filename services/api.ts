
import { Movie, MovieDetail, Magnet, PaginationResponse } from '../types';

// 基础路径设为 /api
const BASE_URL = '/api';

async function fetchClient<T>(endpoint: string): Promise<T> {
  // endpoint 带有斜杠，例如 /movies，拼接后为 /api/movies
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API 错误: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getMovies: async (page: number, type: 'normal' | 'uncensored' = 'normal'): Promise<PaginationResponse> => {
    // 请求地址变为 /api/movies
    const result = await fetchClient<any>(`/movies?page=${page}&type=${type}`);
    
    if (Array.isArray(result)) {
      return {
        movies: result,
        pagination: {
          currentPage: page,
          hasNextPage: result.length > 0,
          nextPage: page + 1,
          prevPage: page > 1 ? page - 1 : null,
        }
      };
    }
    return result;
  },

  searchMovies: async (keyword: string): Promise<Movie[]> => {
    // 请求地址变为 /api/movies/search
    const result = await fetchClient<any>(`/movies/search?keyword=${encodeURIComponent(keyword)}`);
    return Array.isArray(result) ? result : (result.movies || []);
  },

  getMovieDetail: async (movieId: string): Promise<MovieDetail> => {
    // 请求地址变为 /api/movies/:id
    return fetchClient<MovieDetail>(`/movies/${movieId}`);
  },

  getMagnets: async (movieId: string, gid: string, uc: string): Promise<Magnet[]> => {
    // 请求地址变为 /api/magnets/:id
    return fetchClient<Magnet[]>(`/magnets/${movieId}?gid=${gid}&uc=${uc}`);
  }
};
