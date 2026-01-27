
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

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);

    try {
      const src = item.contentSrc || item.image;
      const link = document.createElement('a');
      link.href = src;
      
      const fileName = item.title;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("다운로드 중 오류가 발생했습니다.");
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const renderContent = () => {
    const src = item.contentSrc || item.image;
    const lowerSrc = src.toLowerCase();
    const isPPT = lowerSrc.endsWith('.ppt') || lowerSrc.endsWith('.pptx');
    const isPDF = lowerSrc.endsWith('.pdf');
    
    // 특수 파일 형식 판별 (HWP, 3D Modeling 등)
    const isSpecialDoc = lowerSrc.endsWith('.hwp') || lowerSrc.endsWith('.hwpx') || 
                         lowerSrc.endsWith('.obj') || lowerSrc.endsWith('.stl') || 
                         lowerSrc.endsWith('.zip');

    switch (item.type) {
      case 'video':
        return (
          <div className="w-full bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center">
            <video src={src} controls autoPlay className="max-w-full max-h-full" />
          </div>
        );
      case 'audio':
        return (
          <div className="w-full py-16 md:py-24 px-6 bg-gray-900 rounded-[3rem] text-center shadow-inner">
            <div className="text-7xl mb-8 animate-pulse">🎵</div>
            <audio src={src} controls className="w-full max-w-md mx-auto filter invert brightness-200" />
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-8">Hi-Res Audio Streaming</p>
          </div>
        );
      case 'document':
        if (isPPT) {
          const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`;
          return (
            <div className="w-full h-[65vh] md:h-[75vh] bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-2xl flex flex-col">
              <div className="bg-[#B7472A] px-6 py-3 flex justify-between items-center text-white">
                <span className="text-[10px] font-black uppercase tracking-widest">PowerPoint Presentation</span>
                <span className="text-[10px] font-bold">Cloud Viewer</span>
              </div>
              <iframe src={officeUrl} title={item.title} className="w-full flex-grow border-none" />
            </div>
          );
        }
        if (isPDF) {
          return (
            <div className="w-full h-[65vh] md:h-[75vh] bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-2xl flex flex-col">
              <iframe src={`${src}#toolbar=0`} title={item.title} className="w-full flex-grow bg-white border-none" />
            </div>
          );
        }
        // HWP, 3D 모델링, 기타 문서용 UI
        return (
          <div className="w-full py-20 px-10 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-4xl mb-8">
              {lowerSrc.endsWith('.hwp') ? '📝' : '🧊'}
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase">{item.title}</h3>
            <p className="text-gray-500 text-sm mb-10 max-w-xs">
              이 파일 형식은 브라우저에서 직접 미리보기를 지원하지 않습니다. 아래 버튼을 눌러 파일을 확인하세요.
            </p>
            <button 
              onClick={handleDownload}
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yeonji transition-all transform active:scale-95 shadow-xl"
            >
              파일 열기 / 다운로드
            </button>
          </div>
        );
      default:
        return (
          <div className="relative group max-h-[75vh] w-full flex items-center justify-center">
            <img src={src} alt={item.title} className="max-w-full max-h-[75vh] rounded-2xl md:rounded-3xl shadow-2xl object-contain bg-white" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 bg-white/95 backdrop-blur-3xl animate-fade-in overflow-y-auto">
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[310]">
        <div className="flex flex-col">
          <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter truncate max-w-[200px] md:max-w-xl uppercase">{item.title}</h2>
          <p className="text-yeonji font-black text-[9px] tracking-[0.3em] uppercase opacity-70">{item.category} • {item.type}</p>
        </div>
        <button onClick={onClose} className="p-4 text-gray-900 bg-gray-100 rounded-2xl hover:bg-gray-900 hover:text-white transition-all transform active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="w-full max-w-6xl mt-24 mb-10 flex flex-col items-center">
        {renderContent()}
        <div className="mt-12 flex flex-col md:flex-row items-center gap-6">
          <button onClick={handleDownload} disabled={isDownloading} className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yeonji transition-all shadow-2xl disabled:opacity-50">
            {isDownloading ? 'Downloading...' : 'Save to Device'}
          </button>
          {onDelete && (
            <button onClick={() => { if(confirm('영구 삭제하시겠습니까?')) { onDelete(item.id); onClose(); } }} className="text-red-500 font-black text-[10px] uppercase tracking-widest hover:underline">
              Remove Asset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectViewerModal;
