
import { Movie, MovieDetail, Magnet, PaginationResponse } from '../types';

const BASE_URL = '/api';

async function fetchClient<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API 错误: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getMovies: async (page: number, type: 'normal' | 'uncensored' = 'normal', filter: string = ''): Promise<PaginationResponse> => {
    // 如果有过滤条件（如磁力），通常后端有特定的 endpoint，这里尝试拼接通用参数
    const endpoint = `/movies?page=${page}&type=${type}${filter ? `&magnet=${filter}` : ''}`;
    const result = await fetchClient<any>(endpoint);
    
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

  // 针对演员的专项搜索
  getStarMovies: async (starId: string, page: number = 1): Promise<PaginationResponse> => {
    return fetchClient<PaginationResponse>(`/star/${starId}?page=${page}`);
  },

  // 搜索逻辑增强
  searchMovies: async (keyword: string): Promise<Movie[]> => {
    // 首先尝试普通搜索
    const result = await fetchClient<any>(`/movies/search?keyword=${encodeURIComponent(keyword)}`);
    const movies = Array.isArray(result) ? result : (result.movies || []);
    
    // 如果结果为空且是中文，可能需要转换或调用演员库搜索（此处先返回结果，由 App 层处理展示）
    return movies;
  },

  getMovieDetail: async (movieId: string): Promise<MovieDetail> => {
    return fetchClient<MovieDetail>(`/movies/${movieId}`);
  },

  getMagnets: async (movieId: string, gid: string, uc: string): Promise<Magnet[]> => {
    return fetchClient<Magnet[]>(`/magnets/${movieId}?gid=${gid}&uc=${uc}`);
  }
};
