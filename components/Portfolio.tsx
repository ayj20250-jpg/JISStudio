
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
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video' | 'audio' | 'document'>('all');

  const getTypeIcon = (type: string, src?: string) => {
    const s = src?.toLowerCase() || "";
    if (type === 'document') {
      if (s.endsWith('.ppt') || s.endsWith('.pptx')) return '📊';
      if (s.endsWith('.hwp') || s.endsWith('.hwpx')) return '📝';
      if (s.endsWith('.obj') || s.endsWith('.stl')) return '🧊';
      return '📑';
    }
    switch(type) {
      case 'video': return '🎬';
      case 'audio': return '🎵';
      default: return '📸';
    }
  };

  const handleQuickDownload = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    const src = item.contentSrc || item.image;
    const link = document.createElement('a');
    link.href = src;
    link.download = item.title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateFolder = () => {
    const name = prompt('폴더 이름을 입력하세요:');
    if (name) {
      const newFolder: Folder = {
        id: 'folder-' + Math.random().toString(36).substr(2, 9),
        name,
        type: filterType,
        timestamp: Date.now()
      };
      onCreateFolder(newFolder);
    }
  };

  const activeFolders = folders.filter(f => (filterType === 'all' || f.type === filterType) && !currentFolderId);
  const activeProjects = userProjects.filter(p => {
    const typeMatch = filterType === 'all' || p.type === filterType;
    const folderMatch = p.folderId === (currentFolderId || undefined);
    return typeMatch && folderMatch;
  });

  const currentFolderName = folders.find(f => f.id === currentFolderId)?.name;

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-400 font-black tracking-[0.5em] uppercase text-[9px]">HTTPS Global Network</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 leading-none uppercase">YEONJIS<br/>VAULT</h2>
          </div>
          
          <div className="flex flex-col items-end gap-6 w-full md:w-auto">
            <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl overflow-x-auto max-w-full">
              {['all', 'photo', 'video', 'audio', 'document'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setFilterType(t as any); setCurrentFolderId(null); }}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterType === t ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}
                >
                  {t === 'all' ? '전체' : t}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={handleCreateFolder} className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-yeonji transition-all">📂 NEW FOLDER</button>
              <button onClick={onUploadClick} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yeonji transition-all shadow-2xl">＋ UPLOAD</button>
            </div>
          </div>
        </div>

        <div className="mb-10 flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
           <button 
            onClick={() => setCurrentFolderId(null)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${!currentFolderId ? 'bg-yeonji text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
           >
            🏠 ROOT
           </button>
           {currentFolderId && (
             <>
               <span className="text-gray-300">/</span>
               <div className="px-5 py-2.5 bg-white rounded-xl shadow-sm border border-gray-200 text-[11px] font-black uppercase tracking-widest text-yeonji flex items-center gap-2">
                 <span>📂</span> {currentFolderName}
               </div>
               <button onClick={() => { if(confirm('폴더를 삭제하시겠습니까?')) { onDeleteFolder(currentFolderId); setCurrentFolderId(null); } }} className="ml-auto text-red-400 text-[9px] font-bold uppercase tracking-widest">Delete Folder</button>
             </>
           )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeFolders.map((folder) => (
            <div key={folder.id} onClick={() => setCurrentFolderId(folder.id)} className="group bg-gray-50 rounded-[2.5rem] p-10 border-2 border-transparent hover:border-yeonji/20 hover:bg-white hover:shadow-2xl transition-all cursor-pointer text-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-sm mx-auto mb-6 group-hover:scale-110 transition-transform">📁</div>
              <h3 className="text-lg font-black text-gray-900 mb-1">{folder.name}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{userProjects.filter(p => p.folderId === folder.id).length} ASSETS</p>
            </div>
          ))}

          {activeProjects.map((project) => (
            <div key={project.id} onClick={() => setSelectedProject(project)} className="group bg-white rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100">
              <div className="aspect-square relative bg-gray-50">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute top-5 left-5 flex gap-2">
                  <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    {getTypeIcon(project.type, project.contentSrc)} {project.type}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-white text-lg font-black tracking-tighter truncate mb-1">{project.title}</h3>
                  <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest">{project.category}</p>
                </div>
                
                <button onClick={(e) => handleQuickDownload(e, project)} className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-yeonji hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProjectViewerModal item={selectedProject} onClose={() => setSelectedProject(null)} onDelete={onDelete} />
    </section>
  );
};

export default Portfolio;
