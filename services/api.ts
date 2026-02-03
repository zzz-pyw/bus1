
import { Movie, MovieDetail, Magnet, PaginationResponse } from '../types';

// 使用相对路径，由 vercel.json 或 vite.config.ts 处理代理
const BASE_URL = '/api';

async function fetchClient<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API 错误: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getMovies: async (page: number, type: 'normal' | 'uncensored' = 'normal'): Promise<PaginationResponse> => {
    // 适配 API 路径
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
    // 直接发送原始关键字，后端通常支持部分中文匹配或直接搜索番号
    const result = await fetchClient<any>(`/movies/search?keyword=${encodeURIComponent(keyword)}`);
    return Array.isArray(result) ? result : (result.movies || []);
  },

  getMovieDetail: async (movieId: string): Promise<MovieDetail> => {
    return fetchClient<MovieDetail>(`/movies/${movieId}`);
  },

  getMagnets: async (movieId: string, gid: string, uc: string): Promise<Magnet[]> => {
    return fetchClient<Magnet[]>(`/magnets/${movieId}?gid=${gid}&uc=${uc}`);
  }
};
