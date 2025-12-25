
import React from 'react';
import { GalleryItem } from '../types.ts';

interface ProjectViewerModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const ProjectViewerModal: React.FC<ProjectViewerModalProps> = ({ item, onClose, onDelete }) => {
  if (!item) return null;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.contentSrc || item.image;
    link.download = `${item.title}_Yeonjis_Archive`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    const src = item.contentSrc || item.image;
    switch (item.type) {
      case 'video':
        return (
          <div className="w-full bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center">
            <video src={src} controls autoPlay className="max-w-full max-h-full" />
          </div>
        );
      case 'audio':
        return (
          <div className="w-full py-12 md:py-20 px-6 bg-gray-900 rounded-3xl text-center shadow-inner">
            <div className="text-6xl mb-8 animate-pulse">🎵</div>
            <audio src={src} controls className="w-full max-w-md mx-auto filter invert brightness-200" />
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-8">High-Fidelity Audio Playback</p>
          </div>
        );
      case 'document':
        return (
          <div className="w-full h-[70vh] md:h-[80vh] bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-inner flex flex-col">
            <div className="bg-white px-6 py-3 border-b border-gray-200 flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Premium Document Preview</span>
              <span className="text-[10px] font-bold text-yeonji">Direct View Mode</span>
            </div>
            <iframe 
              src={`${src}#toolbar=0`} 
              title={item.title} 
              className="w-full flex-grow bg-white border-none"
              style={{ minHeight: '500px' }}
            />
          </div>
        );
      default:
        return (
          <div className="relative group max-h-[80vh] w-full flex items-center justify-center overflow-hidden">
            <img 
              src={src} 
              alt={item.title}
              className="max-w-full max-h-[80vh] rounded-2xl md:rounded-3xl shadow-2xl object-contain bg-white/30 backdrop-blur-sm" 
            />
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.05)] pointer-events-none" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 md:p-6 bg-white/98 backdrop-blur-3xl animate-fade-in overflow-y-auto">
      {/* Header controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[310] bg-white/60 backdrop-blur-md md:bg-transparent md:backdrop-blur-none border-b border-gray-100 md:border-none">
        <div className="flex flex-col">
          <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter truncate max-w-[180px] md:max-w-2xl uppercase">
            {item.title}
          </h2>
          <p className="text-yeonji font-black text-[9px] tracking-[0.2em] uppercase opacity-80">
            {item.category} • {item.type}
          </p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {onDelete && (
            <button 
              onClick={() => { if(confirm('영구 삭제하시겠습니까?')) { onDelete(item.id); onClose(); } }} 
              className="p-3 text-red-500 bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all transform active:scale-95 shadow-sm"
              title="삭제"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
          <button 
            onClick={onClose} 
            className="p-3 text-gray-900 bg-gray-100 rounded-2xl hover:bg-gray-900 hover:text-white transition-all transform active:scale-95 shadow-sm"
            title="닫기"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl mt-28 md:mt-24 mb-16 px-4 md:px-0 flex flex-col items-center">
        <div className="w-full flex justify-center mb-10">
          {renderContent()}
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-sm md:max-w-none justify-center">
          <button 
            onClick={handleDownload} 
            className="w-full md:w-auto bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-[11px] tracking-[0.2em] hover:bg-yeonji transition-all shadow-2xl shadow-gray-200 transform active:scale-95 uppercase"
          >
            Download Asset
          </button>
          <span className="hidden md:block text-gray-300 font-light">|</span>
          <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">
            Archived on {new Date(item.timestamp).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectViewerModal;
