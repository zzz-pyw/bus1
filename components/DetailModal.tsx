
import React, { useEffect, useState } from 'react';
import { Movie, MovieDetail, Magnet } from '../types';
import { api } from '../services/api';
import { getProxyImage, copyToClipboard, getExternalLinks } from '../utils';
import { XIcon, CopyIcon, MagnetIcon, PlayIcon, LoaderIcon, SearchIcon } from './Icons';

interface DetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSearchActor?: (name: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ movie, onClose, onSearchActor }) => {
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [magnets, setMagnets] = useState<Magnet[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMagnets, setLoadingMagnets] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState<string>('');

  useEffect(() => {
    if (movie) {
      fetchDetail(movie.id);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [movie]);

  const fetchDetail = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getMovieDetail(id);
      setDetail(data);
      setActiveImg(data.img || movie?.img || '');
      if (data.gid && data.uc) fetchMagnets(id, data.gid, data.uc);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchMagnets = async (id: string, gid: string, uc: string) => {
    setLoadingMagnets(true);
    try {
      const data = await api.getMagnets(id, gid, uc);
      setMagnets(data);
    } catch (error) { console.error(error); } finally { setLoadingMagnets(false); }
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white w-full max-w-6xl max-h-[92vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in zoom-in duration-300">
        
        {/* 左侧预览区 */}
        <div className="w-full lg:w-3/5 bg-[#18191C] relative flex flex-col">
          <div className="flex-1 min-h-[300px] relative overflow-hidden flex items-center justify-center">
            <img 
              src={getProxyImage(activeImg, 1200)} 
              className="max-w-full max-h-full object-contain" 
              alt="cover"
            />
          </div>
          {/* 剧照预览网格 */}
          {detail?.screencaps && detail.screencaps.length > 0 && (
            <div className="h-24 bg-black/50 p-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-white/10">
              <img 
                src={getProxyImage(detail.img, 200)} 
                onClick={() => setActiveImg(detail.img)}
                className={`h-full aspect-video object-cover rounded cursor-pointer border-2 ${activeImg === detail.img ? 'border-[#FB7299]' : 'border-transparent opacity-50'}`}
              />
              {detail.screencaps.map((cap, i) => (
                <img 
                  key={i}
                  src={getProxyImage(cap, 300)} 
                  onClick={() => setActiveImg(cap)}
                  className={`h-full aspect-video object-cover rounded cursor-pointer border-2 ${activeImg === cap ? 'border-[#FB7299]' : 'border-transparent opacity-50'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 右侧信息区 */}
        <div className="w-full lg:w-2/5 p-6 md:p-8 overflow-y-auto bg-white flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#18191C] leading-tight mb-2">{detail?.title || movie.title}</h2>
              <div className="flex gap-2">
                <span className="bg-[#FB7299]/10 text-[#FB7299] px-2 py-0.5 rounded text-xs font-black">{detail?.id || movie.id}</span>
                <span className="text-gray-400 text-xs font-bold self-center">{detail?.date || movie.date}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><XIcon className="w-6 h-6" /></button>
          </div>

          {/* 演员标签 - 模仿脚本增加跳转 */}
          <div className="mb-8">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">出演艺人 (点击搜索)</h3>
             <div className="flex flex-wrap gap-2">
               {detail?.actors?.map((actor, i) => (
                 <button 
                   key={i} 
                   onClick={() => { onSearchActor?.(actor.name); onClose(); }}
                   className="flex items-center gap-2 bg-gray-50 hover:bg-[#00AEEC]/10 border border-gray-100 px-3 py-1.5 rounded-full transition-all group"
                 >
                   <img src={getProxyImage(actor.img || '', 100)} className="w-6 h-6 rounded-full object-cover" />
                   <span className="text-sm font-bold text-gray-700 group-hover:text-[#00AEEC]">{actor.name}</span>
                 </button>
               )) || <span className="text-gray-400 text-xs italic">暂无艺人信息</span>}
             </div>
          </div>

          {/* 外部参考工具箱 - 核心优化：取长补短 */}
          <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
             <h3 className="text-xs font-black text-gray-500 mb-3 flex items-center gap-2">
               <SearchIcon className="w-3 h-3" />
               联动外部站点 (看评论/查评分)
             </h3>
             <div className="grid grid-cols-2 gap-2">
               {getExternalLinks(detail?.id || movie.id).map((link, i) => (
                 <a 
                   key={i} href={link.url} target="_blank" 
                   className={`flex items-center justify-center py-2 px-3 rounded-xl text-white text-[10px] font-bold ${link.color} hover:opacity-90 transition-all shadow-sm active:scale-95`}
                 >
                   {link.name}
                 </a>
               ))}
             </div>
          </div>

          {/* 磁力列表 */}
          <div className="flex-1">
            <h3 className="flex items-center gap-2 text-lg font-black text-[#18191C] mb-4">
              <MagnetIcon className="text-[#00AEEC] w-5 h-5" />
              磁力下载 (JavDB模式)
              {loadingMagnets && <LoaderIcon className="animate-spin w-4 h-4 text-[#FB7299]" />}
            </h3>
            <div className="space-y-3">
              {magnets.map((m) => (
                <div key={m.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                       <p className="text-xs font-bold text-[#18191C] line-clamp-2 mb-2">{m.name}</p>
                       <div className="flex gap-3 text-[10px] text-gray-400 font-bold uppercase">
                         <span className="text-[#FB7299]">{m.size}</span>
                         <span>{m.date}</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => { copyToClipboard(m.link); setCopyStatus(m.id); setTimeout(()=>setCopyStatus(null), 2000); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${copyStatus === m.id ? 'bg-green-500 text-white' : 'bg-[#00AEEC]/10 text-[#00AEEC] hover:bg-[#00AEEC] hover:text-white'}`}
                    >
                      {copyStatus === m.id ? '已复制' : '复制磁力'}
                    </button>
                  </div>
                </div>
              ))}
              {!loadingMagnets && magnets.length === 0 && <p className="text-center py-8 text-gray-400 text-xs italic">暂无直达磁力，建议点击上方“外部链接”查找</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
