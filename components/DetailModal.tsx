import React, { useEffect, useState } from 'react';
import { Movie, MovieDetail, Magnet } from '../types';
import { api } from '../services/api';
import { getProxyImage, copyToClipboard } from '../utils';
import { XIcon, CopyIcon, MagnetIcon, PlayIcon, LoaderIcon } from './Icons';

interface DetailModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ movie, onClose }) => {
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [magnets, setMagnets] = useState<Magnet[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMagnets, setLoadingMagnets] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    if (movie) {
      fetchDetail(movie.id);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [movie]);

  const fetchDetail = async (id: string) => {
    setLoading(true);
    setDetail(null);
    setMagnets([]);
    try {
      const data = await api.getMovieDetail(id);
      setDetail(data);
      if (data.gid && data.uc) {
        fetchMagnets(id, data.gid, data.uc);
      }
    } catch (error) {
      console.error("加载详情失败", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMagnets = async (id: string, gid: string, uc: string) => {
    setLoadingMagnets(true);
    try {
      const data = await api.getMagnets(id, gid, uc);
      setMagnets(data);
    } catch (error) {
      console.error("加载磁力链接失败", error);
    } finally {
      setLoadingMagnets(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    copyToClipboard(text).then(success => {
      if (success) {
        setCopyStatus(id);
        setTimeout(() => setCopyStatus(null), 2000);
      }
    });
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white md:text-gray-500 md:bg-gray-100 md:hover:bg-gray-200 transition-colors"
        >
          <XIcon />
        </button>

        {loading ? (
          <div className="w-full h-96 flex items-center justify-center">
            <LoaderIcon className="animate-spin text-[#FB7299] w-8 h-8" />
          </div>
        ) : (
          <>
            <div className="w-full md:w-2/5 bg-gray-50 relative">
              <div className="aspect-[2/3] md:h-full">
                <img 
                  src={getProxyImage(detail?.img || movie.img, 800)} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="w-full md:w-3/5 p-6 overflow-y-auto max-h-[90vh]">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#18191C] leading-tight mb-2">
                  {detail?.title || movie.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-bold text-[#FB7299] bg-[#FB7299]/10 px-2 py-1 rounded">
                    {detail?.id || movie.id}
                  </span>
                  <span className="text-gray-500">{detail?.date || movie.date}</span>
                  {detail?.studio && (
                    <span className="text-[#00AEEC] bg-[#00AEEC]/10 px-2 py-1 rounded">
                      {detail.studio}
                    </span>
                  )}
                </div>
              </div>

              {detail?.actors && detail.actors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">领衔主演</h3>
                  <div className="flex flex-wrap gap-2">
                    {detail.actors.map((actor, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-full pl-1 pr-3 py-1 text-sm text-[#18191C]">
                         {actor.img && (
                           <img src={getProxyImage(actor.img, 50)} alt={actor.name} className="w-6 h-6 rounded-full object-cover" />
                         )}
                         <span>{actor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-8">
                <a 
                  href={`https://missav.com/search/${detail?.id || movie.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#18191C] hover:bg-[#2F3238] text-white py-3 rounded-xl font-medium transition-colors"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>MissAV 观看</span>
                </a>
                <a 
                  href={`https://jable.tv/search/${detail?.id || movie.id}/`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#FB7299] hover:bg-[#E25D85] text-white py-3 rounded-xl font-medium transition-colors"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Jable 观看</span>
                </a>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#18191C] mb-4">
                  <MagnetIcon className="text-[#00AEEC]" />
                  磁力下载
                  {loadingMagnets && <LoaderIcon className="animate-spin w-4 h-4 text-gray-400" />}
                </h3>

                {magnets.length === 0 && !loadingMagnets ? (
                  <p className="text-gray-400 text-sm">暂无磁力资源，请尝试下方在线观看。</p>
                ) : (
                  <div className="space-y-3">
                    {magnets.map((magnet) => (
                      <div key={magnet.id} className="group bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-lg p-3 transition-colors">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-[#18191C] truncate mb-1">
                              {magnet.name}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="font-mono bg-gray-200 px-1 rounded text-gray-600">{magnet.size}</span>
                              <span>{magnet.date}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleCopy(magnet.link, magnet.id)}
                            className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                              copyStatus === magnet.id 
                                ? 'bg-green-500 text-white' 
                                : 'bg-white text-gray-500 hover:text-[#00AEEC] shadow-sm'
                            }`}
                          >
                            {copyStatus === magnet.id ? (
                              <span className="text-xs font-bold px-1">已复制</span>
                            ) : (
                              <CopyIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};