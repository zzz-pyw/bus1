
import React from 'react';
import { Movie } from '../types';
import { getProxyImage } from '../utils';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div 
      onClick={() => onClick(movie)}
      className="group bg-white rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-full relative"
    >
      {/* 顶部标记 */}
      {movie.date.includes('2026') && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
          NEW
        </div>
      )}

      {/* 封面容器 */}
      <div className="relative aspect-[147/200] overflow-hidden bg-gray-200">
        <img 
          src={getProxyImage(movie.img, 400)} 
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://wsrv.nl/?url=https://www.javbus.com/pics/thumb/placeholder.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
           <span className="text-white text-[10px] font-bold truncate">{movie.title}</span>
        </div>
      </div>

      {/* 信息区域 */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-black text-[#FB7299] bg-[#FB7299]/5 px-1.5 py-0.5 rounded border border-[#FB7299]/10">
            {movie.id}
          </span>
          <span className="text-[10px] font-medium text-gray-400">{movie.date}</span>
        </div>
        
        <h3 className="text-sm text-[#18191C] leading-[1.4] line-clamp-2 font-bold group-hover:text-[#00AEEC] transition-colors mb-2">
          {movie.title}
        </h3>
        
        <div className="mt-auto flex flex-wrap gap-1">
          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[9px] font-bold rounded">
            高清
          </span>
          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[9px] font-bold rounded">
            昨日新种
          </span>
        </div>
      </div>
    </div>
  );
};
