
import React, { useState } from 'react';
import { Movie } from '../types';
import { getProxyImage, getFallbackImage } from '../utils';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [imgSrc, setImgSrc] = useState(getProxyImage(movie.img, 400));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // 第一次错误：尝试使用 JavDB 构造的备选路径
      setImgSrc(getFallbackImage(movie.id, true));
    } else {
      // 第二次错误：显示占位图
      setImgSrc('https://wsrv.nl/?url=https://www.javbus.com/pics/thumb/placeholder.jpg');
    }
  };

  return (
    <div 
      onClick={() => onClick(movie)}
      className="group bg-white rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-full relative"
    >
      {/* 状态标记 */}
      {movie.date.includes('2026') && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-[#FB7299] to-[#E25D85] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg">
          NEW
        </div>
      )}

      {/* 封面容器 */}
      <div className="relative aspect-[147/200] overflow-hidden bg-[#F4F5F7]">
        <img 
          src={imgSrc} 
          alt={movie.title}
          loading="lazy"
          onError={handleError}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
           <div className="flex flex-col gap-1">
             <span className="text-white text-[10px] font-black px-2 py-0.5 bg-[#00AEEC] rounded-md self-start">详情预览</span>
             <span className="text-white text-[10px] font-bold line-clamp-2">{movie.title}</span>
           </div>
        </div>
      </div>

      {/* 信息区域 */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black text-[#FB7299] bg-[#FB7299]/5 px-2 py-0.5 rounded-lg border border-[#FB7299]/10">
            {movie.id}
          </span>
          <span className="text-[10px] font-bold text-gray-400">{movie.date}</span>
        </div>
        
        <h3 className="text-sm text-[#18191C] leading-snug line-clamp-2 font-bold group-hover:text-[#FB7299] transition-colors mb-3">
          {movie.title}
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-1">
            <span className="px-2 py-0.5 bg-[#F4F5F7] text-gray-400 text-[9px] font-bold rounded-md">HD</span>
            <span className="px-2 py-0.5 bg-[#F4F5F7] text-gray-400 text-[9px] font-bold rounded-md">磁力</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
        </div>
      </div>
    </div>
  );
};
