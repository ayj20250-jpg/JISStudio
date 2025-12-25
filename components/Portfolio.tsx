
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

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'document': return '📑';
      default: return '📸';
    }
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

  // 필터링된 폴더와 프로젝트
  const activeFolders = folders.filter(f => (filterType === 'all' || f.type === filterType) && !currentFolderId);
  const activeProjects = userProjects.filter(p => {
    const typeMatch = filterType === 'all' || p.type === filterType;
    const folderMatch = p.folderId === (currentFolderId || undefined);
    return typeMatch && folderMatch;
  });

  const currentFolderName = folders.find(f => f.id === currentFolderId)?.name;

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="w-full md:w-auto">
            <span className="text-yeonji font-black tracking-[0.4em] uppercase text-[9px] mb-3 block animate-fade-in">Cloud Gallery</span>
            <div className="flex items-center gap-4">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 leading-none">ARCHIVE</h2>
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-6 w-full md:w-auto">
            <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl overflow-x-auto w-full md:w-auto">
              {['all', 'photo', 'video', 'audio', 'document'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setFilterType(t as any); setCurrentFolderId(null); }}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterType === t ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'text-gray-400 hover:text-gray-900'}`}
                >
                  {t === 'all' ? '전체' : t}
                </button>
              ))}
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={handleCreateFolder}
                className="flex-1 md:flex-none border-2 border-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-yeonji hover:text-yeonji transition-all flex items-center justify-center gap-3 transform active:scale-95"
              >
                <span>📂</span> 새 폴더
              </button>
              <button 
                onClick={onUploadClick}
                className="flex-1 md:flex-none bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yeonji transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-3 transform active:scale-95"
              >
                <span>＋</span> 게시
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="mb-10 flex items-center gap-4 animate-fade-in">
           <button 
            onClick={() => setCurrentFolderId(null)}
            className={`text-[11px] font-black uppercase tracking-widest ${!currentFolderId ? 'text-yeonji underline' : 'text-gray-400 hover:text-gray-900'}`}
           >
            ROOT
           </button>
           {currentFolderId && (
             <>
               <span className="text-gray-200">/</span>
               <span className="text-[11px] font-black uppercase tracking-widest text-yeonji">
                 {currentFolderName}
               </span>
               <button 
                 onClick={() => { if(confirm('폴더를 삭제하시겠습니까?')) { onDeleteFolder(currentFolderId); setCurrentFolderId(null); } }}
                 className="ml-auto text-red-400 text-[9px] font-bold uppercase tracking-widest hover:underline"
               >
                 Delete Folder
               </button>
             </>
           )}
        </div>

        {activeFolders.length === 0 && activeProjects.length === 0 ? (
          <div className="py-32 text-center border-4 border-dashed border-gray-50 rounded-[3rem] flex flex-col items-center">
             <span className="text-5xl mb-6 grayscale opacity-30">📦</span>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Assets Found in this view</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {/* Folder Rendering */}
            {activeFolders.map((folder) => (
              <div 
                key={folder.id}
                onClick={() => setCurrentFolderId(folder.id)}
                className="group bg-gray-50/50 rounded-[2rem] p-8 border-2 border-transparent hover:border-yeonji/20 hover:bg-white hover:shadow-xl transition-all cursor-pointer flex flex-col relative"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  📁
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">{folder.name}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {userProjects.filter(p => p.folderId === folder.id).length} ITEMS
                </p>
                <div className="absolute top-8 right-8 text-[8px] bg-yeonji/10 text-yeonji px-2 py-1 rounded-lg font-black">FOLDER</div>
              </div>
            ))}

            {/* Project Item Rendering */}
            {activeProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group relative bg-gray-50 rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-slide-up"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-200">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-5 left-5">
                    <span className="bg-white/95 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-xl">
                      {getTypeIcon(project.type)} {project.type}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-white text-xl font-black tracking-tighter truncate">{project.title}</h3>
                    <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest">{project.category}</p>
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
