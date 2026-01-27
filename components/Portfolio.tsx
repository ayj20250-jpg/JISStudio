
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
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video' | 'audio' | 'document' | 'link'>('all');

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

  const handleCreateFolder = () => {
    const name = prompt('폴더 이름을 입력하세요:');
    if (name) {
      onCreateFolder({
        id: 'folder-' + Math.random().toString(36).substr(2, 9),
        name,
        type: filterType === 'link' ? 'all' : filterType as any,
        timestamp: Date.now()
      });
    }
  };

  const activeFolders = folders.filter(f => (filterType === 'all' || f.type === filterType) && !currentFolderId);
  const activeProjects = userProjects.filter(p => {
    const typeMatch = filterType === 'all' || p.type === filterType;
    const folderMatch = p.folderId === (currentFolderId || undefined);
    return typeMatch && folderMatch;
  });

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <span className="text-gray-400 font-black tracking-[0.5em] uppercase text-[9px] mb-2 block">Archive System</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 leading-none uppercase">YEONJIS<br/>VAULT</h2>
          </div>
          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <div className="flex gap-1.5 bg-gray-50 p-1.5 rounded-2xl overflow-x-auto w-full md:w-auto scrollbar-hide">
              {['all', 'photo', 'video', 'document', 'link'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setFilterType(t as any); setCurrentFolderId(null); }}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterType === t ? 'bg-gray-900 text-white' : 'text-gray-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={handleCreateFolder} className="flex-1 md:flex-none border-2 border-gray-100 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest">FOLDER</button>
              <button onClick={onUploadClick} className="flex-1 md:flex-none bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest">UPLOAD</button>
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
           <button onClick={() => setCurrentFolderId(null)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${!currentFolderId ? 'bg-yeonji text-white shadow-lg' : 'text-gray-400'}`}>🏠 ROOT</button>
           {currentFolderId && <span className="text-gray-300">/</span>}
           {currentFolderId && <div className="px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase text-yeonji border border-gray-200">📂 {folders.find(f => f.id === currentFolderId)?.name}</div>}
        </div>

        {/* Mobile: 1 or 2 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
          {activeFolders.map((folder) => (
            <div key={folder.id} onClick={() => setCurrentFolderId(folder.id)} className="bg-gray-50 rounded-[2rem] p-6 md:p-10 border-2 border-transparent hover:border-yeonji/20 hover:bg-white hover:shadow-2xl transition-all cursor-pointer text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mx-auto mb-4">📁</div>
              <h3 className="text-sm md:text-lg font-black text-gray-900 truncate">{folder.name}</h3>
            </div>
          ))}

          {activeProjects.map((project) => (
            <div key={project.id} onClick={() => setSelectedProject(project)} className="group bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all border border-gray-100">
              <div className="aspect-square relative bg-gray-50 overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-white/95 px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest shadow-md">
                    {getTypeIcon(project.type, project.contentSrc)} {project.type}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all">
                  <h3 className="text-white text-xs md:text-sm font-black truncate">{project.title}</h3>
                </div>
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
