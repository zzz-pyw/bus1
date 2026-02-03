import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MovieCard } from './components/MovieCard';
import { DetailModal } from './components/DetailModal';
import { api } from './services/api';
import { Movie, CategoryType } from './types';
import { LoaderIcon } from './components/Icons';

function App() {
  const [category, setCategory] = useState<CategoryType>('normal');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Magnet Filter (Visual/Client-side simulation as API capability is unclear)
  const [showOnlyMagnets, setShowOnlyMagnets] = useState(false);

  // Load Data
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
      // Mapping 'normal' | 'uncensored' for the API type
      const apiType = cat === 'uncensored' ? 'uncensored' : 'normal';
      const data = await api.getMovies(pageNum, apiType);
      
      if (pageNum === 1) {
        setMovies(data.movies);
      } else {
        setMovies(prev => [...prev, ...data.movies]);
      }
    } catch (err) {
      console.error("Failed to fetch movies", err);
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
      console.error("Search failed", err);
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
    setMovies([]); // Clear to show loading state cleanly
  };

  const handleSearch = (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    setCategory('search'); // pseudo-category
    setPage(1);
  };

  // Logic to load more (Simple infinite scroll trigger or button)
  const handleLoadMore = () => {
    if (!isSearching) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] pb-20">
      <Navbar 
        currentCategory={category} 
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Controls / Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#18191C]">
            {isSearching ? `搜索: "${searchQuery}"` : (category === 'uncensored' ? '无码影片' : '最新发布')}
          </h1>

          <label className="flex items-center cursor-pointer space-x-2 select-none">
            <span className="text-sm font-medium text-gray-600">含磁力链</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={showOnlyMagnets} 
                onChange={() => setShowOnlyMagnets(!showOnlyMagnets)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${showOnlyMagnets ? 'bg-[#00AEEC]' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showOnlyMagnets ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
             <MovieCard 
               key={movie.id} 
               movie={movie} 
               onClick={setSelectedMovie} 
             />
          ))}
        </div>

        {/* Empty State */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">未找到相关影片</p>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoaderIcon className="w-10 h-10 text-[#FB7299] animate-spin" />
          </div>
        )}

        {/* Load More Button (Only for standard lists, not search usually) */}
        {!loading && !isSearching && movies.length > 0 && (
          <div className="flex justify-center mt-10">
            <button 
              onClick={handleLoadMore}
              className="bg-white border border-gray-200 hover:border-[#FB7299] hover:text-[#FB7299] text-gray-600 px-8 py-3 rounded-full font-medium transition-all shadow-sm"
            >
              加载更多
            </button>
          </div>
        )}

      </main>

      {/* Modal */}
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