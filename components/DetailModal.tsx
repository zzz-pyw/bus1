
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
  const [imgLoaded, setImgLoaded] = useState(false);

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
    setImgLoaded(false);
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
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-gray-800 shadow-lg transition-all"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="w-full h-96 flex flex-col items-center justify-center gap-3">
            <LoaderIcon className="animate-spin text-[#FB7299] w-10 h-10" />
            <p className="text-gray-400 animate-pulse">正在获取高清资源...</p>
          </div>
        ) : (
          <>
            <div className="w-full md:w-2/5 bg-gray-100 relative overflow-hidden group">
              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <LoaderIcon className="animate-spin text-gray-400" />
                </div>
              )}
              <img 
                src={getProxyImage(detail?.img || movie.img, 800)} 
                alt={movie.title} 
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>

            <div className="w-full md:w-3/5 p-6 overflow-y-auto max-h-[90vh]">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#18191C] leading-tight mb-3">
                  {detail?.title || movie.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white bg-[#FB7299] px-2 py-0.5 rounded text-sm">
                    {detail?.id || movie.id}
                  </span>
                  <span className="text-gray-500 text-sm">{detail?.date || movie.date}</span>
                  {detail?.studio && (
                    <span className="text-[#00AEEC] bg-[#00AEEC]/10 px-2 py-0.5 rounded text-sm font-medium">
                      {detail.studio}
                    </span>
                  )}
                </div>
              </div>

              {detail?.actors && detail.actors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">演员阵容</h3>
                  <div className="flex flex-wrap gap-2">
                    {detail.actors.map((actor, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full pl-1 pr-3 py-1 text-sm text-[#18191C] transition-colors cursor-default">
                         <img 
                           src={getProxyImage(actor.img || '', 100)} 
                           alt={actor.name} 
                           className="w-6 h-6 rounded-full object-cover border border-white shadow-sm" 
                         />
                         <span className="font-medium">{actor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* 切换到更稳定的 .ai 域名 */}
                <a 
                  href={`https://missav.ai/search/${detail?.id || movie.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#18191C] hover:bg-black text-white py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                >
                  <PlayIcon className="w-5 h-5 fill-current" />
                  <span>MissAV 观看</span>
                </a>
                <a 
                  href={`https://jable.tv/search/${detail?.id || movie.id}/`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#FB7299] hover:bg-[#E25D85] text-white py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                >
                  <PlayIcon className="w-5 h-5 fill-current" />
                  <span>Jable 观看</span>
                </a>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#18191C] mb-4">
                  <MagnetIcon className="text-[#00AEEC] w-5 h-5" />
                  磁力资源
                  {loadingMagnets && <LoaderIcon className="animate-spin w-4 h-4 text-[#FB7299]" />}
                </h3>

                {magnets.length === 0 && !loadingMagnets ? (
                  <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm">暂无直达链接，请通过上方在线平台观看</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {magnets.map((magnet) => (
                      <div key={magnet.id} className="group bg-gray-50 hover:bg-white border border-transparent hover:border-[#00AEEC]/30 rounded-xl p-3 transition-all hover:shadow-md">
                        <div className="flex justify-between items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-[#18191C] truncate mb-1 group-hover:text-[#00AEEC]">
                              {magnet.name || "高清磁力链接 (点击右侧复制)"}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] font-bold">
                              <span className="text-[#FB7299] bg-[#FB7299]/10 px-1.5 py-0.5 rounded">{magnet.size}</span>
                              <span className="text-gray-400">{magnet.date}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleCopy(magnet.link, magnet.id)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                              copyStatus === magnet.id 
                                ? 'bg-green-500 text-white shadow-green-200' 
                                : 'bg-white text-[#00AEEC] border border-gray-200 hover:border-[#00AEEC] shadow-sm'
                            }`}
                          >
                            {copyStatus === magnet.id ? "已成功" : (
                              <>
                                <CopyIcon className="w-3.5 h-3.5" />
                                复制
                              </>
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
