
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
      if (!title) setTitle(file.name.split('.')[0]);
      
      const type = file.type.startsWith('image/') ? 'photo' 
                 : file.type.startsWith('video/') ? 'video'
                 : file.type.startsWith('audio/') ? 'audio' : 'document';
      setFileType(type);

      try {
        const url = await uploadFileToCloud(file);
        setCloudUrl(url);
      } catch (err) {
        alert("업로드 실패");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudUrl) {
      alert('파일 업로드 완료를 기다려주세요.');
      return;
    }

    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: title,
      category: category,
      image: fileType === 'photo' ? cloudUrl : 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80',
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">공용 아카이브 게시</h2>
              <p className="text-[10px] font-bold text-yeonji uppercase tracking-widest mt-1">HTTPS Cloud Sync Active</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${cloudUrl ? 'border-green-400 bg-green-50/20' : isUploading ? 'border-yeonji animate-pulse bg-gray-50' : 'border-gray-200 hover:border-yeonji'}`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              {isUploading ? (
                <div className="py-2">
                  <div className="w-8 h-8 border-2 border-yeonji border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-gray-900 text-[10px] font-black uppercase">서버 전송 중...</p>
                </div>
              ) : cloudUrl ? (
                <div>
                  <div className="text-3xl mb-2">☁️</div>
                  <p className="text-green-600 font-bold truncate text-sm">Cloud Ready: {title}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-900 text-sm font-black uppercase">파일을 선택하세요</p>
                  <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">Direct CDN Sync</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-yeonji outline-none transition-all font-bold"
                placeholder="자산 이름"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-yeonji outline-none transition-all font-bold appearance-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="커뮤니티 공유">커뮤니티 공유</option>
                  <option value="개인 자산">개인 자산</option>
                  <option value="브랜딩">브랜딩</option>
                  <option value="미디어">미디어</option>
                </select>

                <select 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-yeonji outline-none transition-all font-bold appearance-none text-yeonji"
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                >
                  <option value="">폴더 없음 (ROOT)</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!cloudUrl || isUploading}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-yeonji transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span>🌍</span> 클라우드에 게시하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PortfolioUploadModal;
