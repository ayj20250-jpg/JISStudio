
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
import { getPublicArchive } from './services/apiService.ts';

const App: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [userProjects, setUserProjects] = useState<GalleryItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedProjects, savedFolders, publicAssets] = await Promise.all([
          getAllProjects(),
          getAllFolders(),
          getPublicArchive()
        ]);
        if (savedFolders) setFolders(savedFolders);
        const combined = [...savedProjects, ...publicAssets];
        const uniqueItems = Array.from(new Map(combined.map(item => [item.id, item])).values());
        setUserProjects(uniqueItems.sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        console.error("Data load error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddToGallery = async (item: GalleryItem) => {
    setUserProjects(prev => [item, ...prev]);
    await saveProject(item);
  };

  const handleCreateFolder = async (folder: Folder) => {
    setFolders(prev => [...prev, folder]);
    await saveFolder(folder);
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("폴더를 삭제하시겠습니까?")) return;
    await deleteFolderFromStorage(folderId);
    setFolders(prev => prev.filter(f => f.id !== folderId));
    setUserProjects(prev => prev.map(p => p.folderId === folderId ? { ...p, folderId: undefined } : p));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 자산을 삭제하시겠습니까?")) return;
    await deleteProject(id);
    setUserProjects(prev => prev.filter(p => p.id !== id));
  };

  // 백업 기능: JSON 파일로 내보내기
  const exportData = () => {
    const data = JSON.stringify({ projects: userProjects, folders }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yeonjis_archive_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 복구 기능: JSON 파일 읽기
  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.projects) {
          for (const p of imported.projects) await saveProject(p);
          setUserProjects(imported.projects);
        }
        if (imported.folders) {
          for (const f of imported.folders) await saveFolder(f);
          setFolders(imported.folders);
        }
        alert("데이터가 성공적으로 복구되었습니다.");
        window.location.reload();
      } catch (err) {
        alert("잘못된 파일 형식입니다.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onUploadClick={() => setIsUploadModalOpen(true)} />
      
      <main className="flex-grow">
        <Hero onUploadClick={() => setIsUploadModalOpen(true)} />
        <About />
        <UploadSection onPublish={handleAddToGallery} />
        
        <section className="relative">
          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-yeonji border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Archive Loading</p>
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

        <SyncSection onExport={exportData} onImport={importData} />
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
