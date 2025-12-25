
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import UploadSection from './components/UploadSection.tsx';
import Portfolio from './components/Portfolio.tsx';
import SyncSection from './components/SyncSection.tsx';
import Contact from './components/Contact.tsx';
import Footer from './components/Footer.tsx';
import PortfolioUploadModal from './components/PortfolioUploadModal.tsx';
import { GalleryItem, Folder } from './types.ts';
import { getAllProjects, saveProject, deleteProject, getAllFolders, saveFolder, deleteFolder as deleteFolderFromStorage } from './services/storageService.ts';

const App: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [userProjects, setUserProjects] = useState<GalleryItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'done'>('idle');

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        setSyncStatus('syncing');
        
        // 데이터 로드
        const [savedProjects, savedFolders] = await Promise.all([
          getAllProjects(),
          getAllFolders()
        ]);

        if (savedFolders) setFolders(savedFolders);

        if (savedProjects && savedProjects.length > 0) {
          const rehydrated = savedProjects.map(proj => {
            if (proj.fileData instanceof Blob) {
              const url = URL.createObjectURL(proj.fileData);
              return { 
                ...proj, 
                contentSrc: url, 
                image: proj.type === 'photo' ? url : proj.image 
              };
            }
            return proj;
          });
          setUserProjects(rehydrated.sort((a, b) => b.timestamp - a.timestamp));
        }
        setTimeout(() => setSyncStatus('done'), 1000);
      } catch (error) {
        console.error("Storage load error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedData();
  }, []);

  const handleAddToGallery = async (item: GalleryItem) => {
    setUserProjects(prev => [item, ...prev]);
    setSyncStatus('syncing');
    try {
      await saveProject(item);
      setTimeout(() => setSyncStatus('done'), 800);
    } catch (e) {
      console.error("Save error:", e);
      setSyncStatus('idle');
    }
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateFolder = async (folder: Folder) => {
    setFolders(prev => [...prev, folder]);
    await saveFolder(folder);
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("폴더를 삭제하시겠습니까? 폴더 안의 파일들은 '폴더 없음'으로 변경됩니다.")) return;
    try {
      await deleteFolderFromStorage(folderId);
      setFolders(prev => prev.filter(f => f.id !== folderId));
      setUserProjects(prev => prev.map(p => p.folderId === folderId ? { ...p, folderId: undefined } : p));
    } catch (e) {
      console.error("Delete folder error:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 자산을 보관소에서 영구 삭제하시겠습니까?")) return;
    try {
      await deleteProject(id);
      setUserProjects(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-yeonji selection:text-white">
      <Navbar onUploadClick={() => setIsUploadModalOpen(true)} />
      
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[110] transition-all duration-700 ${syncStatus === 'syncing' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
        <div className="bg-gray-900/80 backdrop-blur-2xl text-white px-8 py-3 rounded-full text-[10px] font-black tracking-[0.4em] flex items-center gap-4 shadow-2xl border border-white/10 uppercase">
          <div className="w-2 h-2 bg-yeonji rounded-full animate-ping" />
          Synchronizing with Vault
        </div>
      </div>

      <main className="flex-grow">
        <Hero onUploadClick={() => setIsUploadModalOpen(true)} />
        <About />
        <UploadSection onPublish={handleAddToGallery} />
        
        <section className="relative min-h-[400px]">
          {isLoading ? (
            <div className="py-40 text-center flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-yeonji border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Secure Archive</p>
            </div>
          ) : (
            <Portfolio 
              userProjects={userProjects} 
              folders={folders}
              onCreateFolder={handleCreateFolder}
              onDeleteFolder={handleDeleteFolder}
              onDelete={handleDelete} 
              onUploadClick={() => setIsUploadModalOpen(true)}
            />
          )}
        </section>

        <SyncSection />
        <Contact />
      </main>
      
      <Footer />
      
      <PortfolioUploadModal 
        isOpen={isUploadModalOpen} 
        folders={folders}
        onClose={() => setIsUploadModalOpen(false)} 
        onUploadSuccess={handleAddToGallery} 
      />
    </div>
  );
};

export default App;
