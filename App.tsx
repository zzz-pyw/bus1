
import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { MovieCard } from './components/MovieCard';
import { DetailModal } from './components/DetailModal';
import { api } from './services/api';
import { Movie, CategoryType } from './types';
import { LoaderIcon, MagnetIcon } from './components/Icons';

function App() {
  const [category, setCategory] = useState<CategoryType>('normal');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyMagnets, setShowOnlyMagnets] = useState(false);

  // 核心修复：磁力链接客户端过滤
  // 现实中 API 可能没返回 hasMagnet，我们会基于数据动态处理
  const displayedMovies = useMemo(() => {
    if (!showOnlyMagnets) return movies;
    // 如果 API 没给标记，通常带磁力的影片标题会含有特殊字符或在详情页才有。
    // 这里我们先进行简单的过滤，如果没有标记，建议用户点击详情查看
    return movies.filter(m => m.hasMagnet !== false); 
  }, [movies, showOnlyMagnets]);

  useEffect(() => {
    if (isSearching) {
      performSearch(searchQuery);
    } else {
      loadMovies(page, category);
    }
  }, [page, category, isSearching, searchQuery]);

  const loadMovies = async (pageNum: number, cat: CategoryType) => {
    setLoading(true);
    try {
      const apiType = cat === 'uncensored' ? 'uncensored' : 'normal';
      // 注意：部分接口可能支持 ?magnet=all 参数来只获取有磁力的
      const data = await api.getMovies(pageNum, apiType);
      
      if (pageNum === 1) {
        setMovies(data.movies);
      } else {
        // 简单去重
        const newMovies = data.movies.filter(nm => !movies.some(m => m.id === nm.id));
        setMovies(prev => [...prev, ...newMovies]);
      }
    } catch (err) {
      console.error("加载失败", err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      const results = await api.searchMovies(query);
      setMovies(results);
    } catch (err) {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCat: CategoryType) => {
    setIsSearching(false);
    setSearchQuery('');
    setCategory(newCat);
    setPage(1);
    setMovies([]);
  };

  const handleSearch = (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    setCategory('search');
    setPage(1);
    setMovies([]);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] pb-20">
      <Navbar 
        currentCategory={category} 
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* 顶部热门筛选 */}
        {!isSearching && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs font-bold text-gray-400 self-center mr-2 uppercase tracking-tighter">快速分类:</span>
            {['单体', '巨乳', '素人', '御姐', '萝莉', '高清'].map(tag => (
              <button 
                key={tag}
                onClick={() => handleSearch(tag)}
                className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs text-gray-600 hover:border-[#00AEEC] hover:text-[#00AEEC] transition-all shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* 标题与磁力开关 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#18191C] flex items-center gap-3">
              {isSearching ? `搜索: "${searchQuery}"` : (category === 'uncensored' ? '无码影片' : '最新更新')}
              {!loading && <span className="text-sm font-normal text-gray-400">({displayedMovies.length} 结果)</span>}
            </h1>
          </div>

          <div className="flex items-center gap-6 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <label className="flex items-center cursor-pointer space-x-3 select-none">
              <div className="flex items-center gap-1">
                <MagnetIcon className={`w-4 h-4 ${showOnlyMagnets ? 'text-[#00AEEC]' : 'text-gray-400'}`} />
                <span className={`text-sm font-bold ${showOnlyMagnets ? 'text-[#00AEEC]' : 'text-gray-500'}`}>
                  仅看磁力
                </span>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={showOnlyMagnets} 
                  onChange={() => setShowOnlyMagnets(!showOnlyMagnets)}
                />
                <div className={`block w-11 h-6 rounded-full transition-colors ${showOnlyMagnets ? 'bg-[#00AEEC]' : 'bg-gray-200'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${showOnlyMagnets ? 'transform translate-x-5' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* 影片网格 */}
        {displayedMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
            {displayedMovies.map((movie) => (
               <MovieCard 
                 key={movie.id} 
                 movie={movie} 
                 onClick={setSelectedMovie} 
               />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <LoaderIcon className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg">哎呀，没找到相关资源</p>
              <button 
                onClick={() => {setShowOnlyMagnets(false); handleCategoryChange('normal');}}
                className="mt-4 text-[#00AEEC] font-bold hover:underline"
              >
                返回首页看看
              </button>
            </div>
          )
        )}

        {/* 加载状态 */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <LoaderIcon className="w-12 h-12 text-[#FB7299] animate-spin" />
            <p className="text-gray-400 text-sm animate-pulse">正在从总线同步数据...</p>
          </div>
        )}

        {/* 分页加载 */}
        {!loading && !isSearching && displayedMovies.length > 0 && (
          <div className="flex justify-center mt-12 mb-20">
            <button 
              onClick={() => setPage(prev => prev + 1)}
              className="group flex items-center gap-2 bg-white border-2 border-gray-100 hover:border-[#FB7299] hover:text-[#FB7299] text-gray-600 px-10 py-4 rounded-2xl font-bold transition-all shadow-sm hover:shadow-lg"
            >
              加载更多影片
              <div className="w-1.5 h-1.5 bg-[#FB7299] rounded-full group-hover:animate-ping" />
            </button>
          </div>
        )}

      </main>

      {selectedMovie && (
        <DetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}

export default App;
