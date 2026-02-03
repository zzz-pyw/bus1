
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyMagnets, setShowOnlyMagnets] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);

  const displayedMovies = useMemo(() => {
    if (!showOnlyMagnets) return movies;
    return movies.filter(m => m.hasMagnet !== false); 
  }, [movies, showOnlyMagnets]);

  // 加载数据核心函数
  const loadData = useCallback(async (pageNum: number, cat: CategoryType, query?: string) => {
    if (loading) return;
    setLoading(true);
    try {
      let results: Movie[] = [];
      if (isSearching || query) {
        const searchResults = await api.searchMovies(query || searchQuery);
        results = searchResults;
        setHasMore(false); // 搜索通常一次性返回
      } else {
        const apiType = cat === 'uncensored' ? 'uncensored' : 'normal';
        const data = await api.getMovies(pageNum, apiType);
        results = data.movies;
        setHasMore(data.pagination.hasNextPage);
      }

      setMovies(prev => {
        if (pageNum === 1) return results;
        // 去重合并
        const existingIds = new Set(prev.map(m => m.id));
        return [...prev, ...results.filter(r => !existingIds.has(r.id))];
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, category, isSearching, searchQuery]);

  // 监听分类/搜索词变化，重置状态
  useEffect(() => {
    setPage(1);
    setMovies([]);
    loadData(1, category);
  }, [category, isSearching, searchQuery]);

  // 实现无限滚动 (模仿东方永页机)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !isSearching) {
          setPage(prev => {
            const nextPage = prev + 1;
            loadData(nextPage, category);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, isSearching, category, loadData]);

  const handleCategoryChange = (newCat: CategoryType) => {
    setIsSearching(false);
    setSearchQuery('');
    setCategory(newCat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    setCategory('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] pb-20">
      <Navbar 
        currentCategory={category} 
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* 快速筛选标签 */}
        {!isSearching && (
          <div className="flex flex-wrap gap-2 mb-8 items-center">
            <span className="text-[10px] font-black text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm mr-2 uppercase">分类探索</span>
            {['单体', '巨乳', '御姐', '高清', '无码', 'FC2', 'VR'].map(tag => (
              <button 
                key={tag} onClick={() => handleSearch(tag)}
                className="px-4 py-1.5 bg-white hover:bg-[#FB7299] hover:text-white rounded-full text-xs font-bold text-gray-600 transition-all shadow-sm active:scale-90"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <h1 className="text-2xl font-black text-[#18191C] flex items-center gap-3">
            {isSearching ? `搜索: "${searchQuery}"` : (category === 'uncensored' ? '无码影片' : '最新发布')}
            <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-100">{displayedMovies.length} 结果</span>
          </h1>

          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
            <label className="flex items-center cursor-pointer space-x-3 select-none">
              <div className="flex items-center gap-1.5">
                <MagnetIcon className={`w-4 h-4 ${showOnlyMagnets ? 'text-[#00AEEC]' : 'text-gray-300'}`} />
                <span className={`text-xs font-black ${showOnlyMagnets ? 'text-[#00AEEC]' : 'text-gray-400'}`}>仅看磁力</span>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={showOnlyMagnets} onChange={() => setShowOnlyMagnets(!showOnlyMagnets)} />
                <div className={`block w-10 h-5 rounded-full transition-colors ${showOnlyMagnets ? 'bg-[#00AEEC]' : 'bg-gray-200'}`}></div>
                <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-md ${showOnlyMagnets ? 'transform translate-x-5' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* 影片网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {displayedMovies.map((movie) => (
             <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
          ))}
        </div>

        {/* 瀑布流加载指示器 */}
        <div ref={loaderRef} className="py-20 flex flex-col items-center justify-center gap-4">
          {loading ? (
            <>
              <LoaderIcon className="w-12 h-12 text-[#FB7299] animate-spin" />
              <p className="text-gray-400 text-sm font-bold animate-pulse">正在穿梭次元抓取资源...</p>
            </>
          ) : !hasMore && displayedMovies.length > 0 ? (
            <p className="text-gray-300 font-bold text-sm">--- 已到达次元边界 ---</p>
          ) : null}
        </div>

        {/* 空结果 */}
        {!loading && displayedMovies.length === 0 && (
          <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
             <h3 className="text-xl font-black text-gray-300 mb-4">空空如也，换个关键词搜搜看？</h3>
             <button onClick={()=>handleCategoryChange('normal')} className="bg-[#FB7299] text-white px-10 py-3 rounded-2xl font-black shadow-xl shadow-[#FB7299]/20">回首页</button>
          </div>
        )}
      </main>

      {selectedMovie && (
        <DetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          onSearchActor={handleSearch}
        />
      )}
    </div>
  );
}

export default App;
