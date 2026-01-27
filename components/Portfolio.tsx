
import React, { useState } from 'react';
import { GalleryItem, Folder } from '../types.ts';
import ProjectViewerModal from './ProjectViewerModal.tsx';

interface PortfolioProps {
  userProjects?: GalleryItem[];
  folders: Folder[];
  onCreateFolder: (folder: Folder) => void;
  onDeleteFolder: (folderId: string) => void;
  onDelete?: (id: string) => void;
  onUploadClick?: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ 
  userProjects = [], 
  folders = [], 
  onCreateFolder, 
  onDeleteFolder,
  onDelete, 
  onUploadClick 
}) => {
  const [selectedProject, setSelectedProject] = useState<GalleryItem | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video' | 'document' | 'link'>('all');

  const getTypeIcon = (type: string, src?: string) => {
    const s = src?.toLowerCase() || "";
    if (type === 'link') return '🔗';
    if (type === 'document') {
      if (s.endsWith('.ppt') || s.endsWith('.pptx')) return '📊';
      if (s.endsWith('.hwp') || s.endsWith('.hwpx')) return '📝';
      return '📑';
    }
    return type === 'video' ? '🎬' : type === 'audio' ? '🎵' : '📸';
  };

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return null;
    }
  };

  const getDomainName = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const activeFolders = folders.filter(f => (filterType === 'all' || f.type === filterType) && !currentFolderId);
  const activeProjects = userProjects.filter(p => {
    const typeMatch = filterType === 'all' || p.type === filterType;
    const folderMatch = p.folderId === (currentFolderId || undefined);
    return typeMatch && folderMatch;
  });

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span className="text-gray-400 font-black tracking-[0.4em] uppercase text-[9px] mb-2 block">Archive System</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-gray-900 leading-none uppercase">YEONJIS<br/>VAULT</h2>
          </div>
          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto scrollbar-hide">
              {['all', 'photo', 'video', 'document', 'link'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setFilterType(t as any); setCurrentFolderId(null); }}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterType === t ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={onUploadClick} className="flex-1 md:flex-none bg-gray-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">UPLOAD</button>
            </div>
          </div>
        </div>

        {/* Folder Hierarchy Info */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setCurrentFolderId(null)}
            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${!currentFolderId ? 'bg-yeonji text-white' : 'bg-gray-100 text-gray-400'}`}
          >
            🏠 Root
          </button>
          {currentFolderId && (
            <>
              <span className="text-gray-300">/</span>
              <span className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
                📂 {folders.find(f => f.id === currentFolderId)?.name}
              </span>
            </>
          )}
        </div>

        {/* Mobile Grid: grid-cols-2 is essential for 2 columns on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {activeFolders.map((folder) => (
            <div key={folder.id} onClick={() => setCurrentFolderId(folder.id)} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-yeonji/20 hover:bg-white transition-all cursor-pointer text-center flex flex-col items-center justify-center">
              <div className="text-3xl mb-2">📁</div>
              <h3 className="text-[11px] md:text-sm font-black text-gray-900 truncate w-full uppercase">{folder.name}</h3>
            </div>
          ))}

          {activeProjects.map((project) => (
            <div key={project.id} onClick={() => setSelectedProject(project)} className="group bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-gray-100 transition-all hover:shadow-xl active:scale-95">
              <div className="aspect-square relative bg-gray-50 overflow-hidden">
                {project.type === 'link' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
                    <img src={getFavicon(project.contentSrc || '') || ''} className="w-10 h-10 md:w-12 md:h-12 rounded-xl mb-3 shadow-sm bg-white p-1" alt="favicon" />
                    <p className="text-[9px] md:text-[11px] font-black text-gray-900 text-center line-clamp-2 uppercase tracking-tight">{project.title}</p>
                    <p className="text-[7px] md:text-[8px] text-gray-400 mt-1 truncate w-full text-center">{getDomainName(project.contentSrc || '')}</p>
                  </div>
                ) : (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 left-2">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[7px] font-black uppercase tracking-widest shadow-sm">
                    {getTypeIcon(project.type, project.contentSrc)} {project.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeProjects.length === 0 && activeFolders.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
            <p className="text-gray-300 font-black text-xs uppercase tracking-[0.5em]">No Assets Found</p>
          </div>
        )}
      </div>
      <ProjectViewerModal item={selectedProject} onClose={() => setSelectedProject(null)} onDelete={onDelete} />
    </section>
  );
};

export default Portfolio;
