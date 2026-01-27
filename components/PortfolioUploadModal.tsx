
import React, { useState, useRef } from 'react';
import { GalleryItem, Folder } from '../types.ts';
import { uploadFileToCloud } from '../services/apiService';

interface Props {
  isOpen: boolean;
  folders: Folder[];
  onClose: () => void;
  onUploadSuccess: (item: GalleryItem) => void;
}

const PortfolioUploadModal: React.FC<Props> = ({ isOpen, folders, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('개인 자산');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [cloudUrl, setCloudUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const fileName = file.name;
      if (!title) setTitle(fileName.split('.')[0]);
      
      const lowerName = fileName.toLowerCase();
      let type: 'photo' | 'video' | 'audio' | 'document' = 'document';
      
      if (file.type.startsWith('image/')) type = 'photo';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      else if (lowerName.endsWith('.pdf') || lowerName.endsWith('.ppt') || lowerName.endsWith('.pptx') || 
               lowerName.endsWith('.hwp') || lowerName.endsWith('.hwpx') || lowerName.endsWith('.obj') || 
               lowerName.endsWith('.stl')) {
        type = 'document';
      }
      
      setFileType(type);

      try {
        const url = await uploadFileToCloud(file);
        setCloudUrl(url);
      } catch (err) {
        alert("클라우드 업로드 실패");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudUrl) return alert('업로드 완료를 기다려주세요.');

    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: title,
      category: category,
      image: fileType === 'photo' ? cloudUrl : 
             title.toLowerCase().includes('ppt') ? 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80' :
             'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80',
      contentSrc: cloudUrl,
      type: fileType as any,
      folderId: selectedFolderId || undefined,
      timestamp: Date.now()
    };

    onUploadSuccess(newItem);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setCloudUrl(null);
    setSelectedFolderId('');
    setIsUploading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Cloud Archive</h2>
              <p className="text-[10px] font-bold text-yeonji uppercase tracking-widest mt-1">HTTPS Persistence Enabled</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleUpload} className="space-y-8">
            <div onClick={() => !isUploading && fileInputRef.current?.click()} className={`border-3 border-dashed rounded-[2rem] p-10 text-center cursor-pointer transition-all ${cloudUrl ? 'border-green-400 bg-green-50/20' : isUploading ? 'border-yeonji animate-pulse' : 'border-gray-200 hover:border-yeonji'}`}>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              {isUploading ? (
                <div className="py-4">
                  <div className="w-10 h-10 border-4 border-yeonji border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-900 text-xs font-black uppercase tracking-widest">Uploading to S3...</p>
                </div>
              ) : cloudUrl ? (
                <div className="animate-fade-in">
                  <div className="text-5xl mb-4">🌍</div>
                  <p className="text-green-600 font-black text-sm uppercase tracking-wider">Ready to Synchronize</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-900 font-black text-sm uppercase">Select Any File</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">PPT, HWP, 3D, H.264, Lossless</p>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <input type="text" className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-transparent focus:border-yeonji outline-none transition-all font-black text-sm" placeholder="ASSET TITLE" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <div className="grid grid-cols-2 gap-4">
                <select className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:border-yeonji outline-none font-black text-[11px] appearance-none" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="커뮤니티 공유">커뮤니티 공유</option>
                  <option value="개인 자산">개인 자산</option>
                  <option value="브랜딩">브랜딩</option>
                  <option value="미디어">미디어</option>
                </select>
                <select className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:border-yeonji outline-none font-black text-[11px] appearance-none text-yeonji" value={selectedFolderId} onChange={(e) => setSelectedFolderId(e.target.value)}>
                  <option value="">🏠 ROOT (No Folder)</option>
                  {folders.map(folder => <option key={folder.id} value={folder.id}>📂 {folder.name}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={!cloudUrl || isUploading} className="w-full bg-gray-900 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.3em] hover:bg-yeonji transition-all shadow-2xl disabled:opacity-50 transform active:scale-95">
              Sync to Global Archive
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PortfolioUploadModal;
