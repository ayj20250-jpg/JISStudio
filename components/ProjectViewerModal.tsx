
import React, { useState } from 'react';
import { GalleryItem } from '../types.ts';

interface ProjectViewerModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const ProjectViewerModal: React.FC<ProjectViewerModalProps> = ({ item, onClose, onDelete }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!item) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    const src = item.contentSrc || item.image;
    const link = document.createElement('a');
    link.href = src;
    link.download = item.title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  const renderContent = () => {
    const src = item.contentSrc || item.image;
    const lowerSrc = src.toLowerCase();
    
    if (item.type === 'link') {
      return (
        <div className="w-full py-16 px-6 bg-gray-50 rounded-[2.5rem] text-center border border-gray-200">
          <div className="text-5xl mb-6">🌐</div>
          <h3 className="text-xl font-black mb-2 uppercase tracking-tighter leading-tight px-4">{item.title}</h3>
          <p className="text-gray-400 text-[10px] mb-10 truncate max-w-xs mx-auto px-4">{src}</p>
          <a href={src} target="_blank" rel="noreferrer" className="inline-block bg-gray-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yeonji transition-all">Visit Website</a>
        </div>
      );
    }

    switch (item.type) {
      case 'video':
        return (
          <div className="w-full bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center">
            <video src={src} controls autoPlay className="max-w-full max-h-full asset-contain" />
          </div>
        );
      case 'document':
        if (lowerSrc.endsWith('.ppt') || lowerSrc.endsWith('.pptx')) {
          const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`;
          return (
            <div className="w-full h-[50vh] md:h-[70vh] bg-white rounded-xl overflow-hidden border shadow-inner flex flex-col">
              <div className="bg-[#B7472A] px-4 py-2 flex justify-between items-center text-white text-[8px] font-black uppercase">
                <span>PowerPoint Viewer</span>
                <span>Live Mode</span>
              </div>
              <iframe src={officeUrl} title={item.title} className="w-full flex-grow border-none" />
            </div>
          );
        }
        return (
          <div className="w-full py-16 px-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center text-center">
            <div className="text-4xl mb-6">{lowerSrc.endsWith('.hwp') ? '📝' : '📑'}</div>
            <h3 className="text-sm font-black mb-8 uppercase tracking-widest">{item.title}</h3>
            <button onClick={handleDownload} className="bg-gray-900 text-white px-8 py-4 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-yeonji transition-all">Download to Open</button>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-gray-50/50 rounded-xl overflow-hidden">
            <img src={src} alt={item.title} className="max-w-full max-h-[70vh] asset-contain shadow-xl" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-white/98 backdrop-blur-3xl animate-fade-in overflow-y-auto">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-[310]">
        <div className="flex flex-col">
          <h2 className="text-xs md:text-xl font-black text-gray-900 uppercase truncate max-w-[140px] md:max-w-xl">{item.title}</h2>
          <p className="text-yeonji font-black text-[7px] tracking-widest uppercase opacity-70">{item.type} asset</p>
        </div>
        <button onClick={onClose} className="p-3 bg-gray-100 rounded-xl hover:bg-gray-900 hover:text-white transition-all transform active:scale-95">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="w-full max-w-5xl mt-16 mb-8 flex flex-col items-center">
        <div className="w-full">
          {renderContent()}
        </div>
        <div className="mt-8 flex gap-3 w-full justify-center">
          <button onClick={handleDownload} disabled={isDownloading} className="px-6 py-3.5 bg-gray-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-yeonji transition-all flex-1 md:flex-none">
            {isDownloading ? 'Saving...' : 'Download'}
          </button>
          {onDelete && <button onClick={() => { if(confirm('영구 삭제하시겠습니까?')) { onDelete(item.id); onClose(); } }} className="px-6 py-3.5 bg-red-50 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest flex-1 md:flex-none">Delete</button>}
        </div>
      </div>
    </div>
  );
};

export default ProjectViewerModal;
