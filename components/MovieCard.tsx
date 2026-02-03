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
      className="group bg-white rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      {/* Image Container with Aspect Ratio */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-200">
        <img 
          src={getProxyImage(movie.img)} 
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover (Bilibili style play icon) */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {/* Optional: Add a play button overlay here if desired */}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm font-bold text-[#FB7299]">{movie.id}</span>
          <span className="text-xs text-gray-400">{movie.date}</span>
        </div>
        <h3 className="text-sm text-[#18191C] leading-snug line-clamp-2 font-medium group-hover:text-[#00AEEC] transition-colors">
          {movie.title}
        </h3>
        
        {/* Tags if available */}
        {movie.tags && movie.tags.length > 0 && (
          <div className="mt-auto pt-2 flex flex-wrap gap-1">
            {movie.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};