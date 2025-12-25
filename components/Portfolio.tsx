
import React, { useState } from 'react';
import { GalleryItem } from '../types.ts';
import ProjectViewerModal from './ProjectViewerModal.tsx';

interface PortfolioProps {
  userProjects?: GalleryItem[];
  onDelete?: (id: string) => void;
  onUploadClick?: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ userProjects = [], onDelete, onUploadClick }) => {
  const [selectedProject, setSelectedProject] = useState<GalleryItem | null>(null);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'document': return '📑';
      default: return '📸';
    }
  };

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-yeonji font-black tracking-[0.4em] uppercase text-[9px] mb-3 block">Cloud Gallery</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900">ARCHIVE</h2>
          </div>
          
          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <button 
              onClick={onUploadClick}
              className="w-full md:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yeonji transition-all shadow-xl flex items-center justify-center gap-3 group"
            >
              <span className="text-xl group-hover:rotate-90 transition-transform">＋</span>
              영구 보관소 게시
            </button>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest hidden md:block">
              Total Assets: {userProjects.length}
            </p>
          </div>
        </div>

        {userProjects.length === 0 ? (
          <div 
            onClick={onUploadClick}
            className="group py-20 md:py-32 text-center border-4 border-dashed border-gray-100 rounded-[3rem] cursor-pointer hover:border-yeonji/30 transition-all bg-gray-50/30"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-3xl">📂</span>
            </div>
            <p className="text-gray-400 font-bold mb-2">보관된 자산이 없습니다.</p>
            <p className="text-yeonji text-sm font-black uppercase tracking-widest">지금 첫 자산을 게시해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {userProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group relative bg-gray-50 rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-slide-up"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {getTypeIcon(project.type)} {project.type}
                    </span>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-white text-2xl font-black tracking-tighter mb-1 truncate">{project.title}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{project.category}</p>
                      <span className="text-white/40 text-[8px] font-medium">{new Date(project.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProjectViewerModal 
        item={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onDelete={onDelete}
      />
    </section>
  );
};

export default Portfolio;
