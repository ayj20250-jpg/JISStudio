
import React, { useState, useRef } from 'react';
import { GalleryItem } from '../types.ts';
import { uploadFileToCloud } from '../services/apiService.ts';

interface UploadSectionProps {
  onPublish: (item: GalleryItem) => void;
}

const categories = [
  { id: 'photo', title: '사진', desc: '4K+, Raw Support', icon: '📸' },
  { id: 'video', title: '영상', desc: 'MP4 / MOV High', icon: '🎬' },
  { id: 'link', title: '링크', desc: 'URL Smart Sync', icon: '🔗' },
  { id: 'document', title: '문서', desc: 'PDF / PPT / HWP', icon: '📑' }
];

const UploadSection: React.FC<UploadSectionProps> = ({ onPublish }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isCloudUploading, setIsCloudUploading] = useState(false);
  const [cloudUrl, setCloudUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsCloudUploading(true);
      try {
        const persistentUrl = await uploadFileToCloud(file);
        setCloudUrl(persistentUrl);
      } catch (error) {
        alert("업로드 실패");
      } finally {
        setIsCloudUploading(false);
      }
    }
  };

  const handleUrlPublish = () => {
    if (!urlInput.trim()) return;
    
    const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(urlInput);
    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: isImage ? '연결된 이미지' : '웹 사이트 카드',
      category: '외부 링크',
      image: isImage ? urlInput : 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&w=400&q=80',
      contentSrc: urlInput,
      type: isImage ? 'photo' : 'link',
      timestamp: Date.now(),
      isExternal: true
    };
    onPublish(newItem);
    setUrlInput('');
    setActiveTab(null);
  };

  const handlePublish = () => {
    if (!activeTab || !fileName || !cloudUrl) return;

    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: fileName.split('.')[0],
      category: categories.find(c => c.id === activeTab)?.title || '기타',
      image: activeTab === 'photo' ? cloudUrl : 
             fileName.toLowerCase().endsWith('.ppt') || fileName.toLowerCase().endsWith('.pptx') ? 
             'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80' :
             'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80',
      contentSrc: cloudUrl,
      type: activeTab as any,
      timestamp: Date.now()
    };

    onPublish(newItem);
    setActiveTab(null);
    setCloudUrl(null);
    setFileName('');
  };

  return (
    <div id="upload-section" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-yeonji font-black tracking-[0.5em] uppercase text-[10px] mb-4 block">Archive Center</span>
          <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">CLOUD UPLOAD</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveTab(cat.id); setCloudUrl(null); setUrlInput(''); }}
              className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center justify-center text-center bg-white ${activeTab === cat.id ? 'border-yeonji shadow-2xl scale-105' : 'border-transparent hover:scale-102'}`}
            >
              <span className="text-4xl mb-4">{cat.icon}</span>
              <h3 className="text-base font-black mb-1">{cat.title}</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{cat.desc}</p>
            </button>
          ))}
        </div>

        {activeTab === 'link' && (
          <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-10 shadow-2xl animate-fade-up border border-gray-100">
             <h4 className="text-xl font-black mb-6 uppercase tracking-widest">Paste Website URL</h4>
             <input 
              type="text" 
              className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-transparent focus:border-yeonji outline-none transition-all font-bold mb-6"
              placeholder="https://example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
             />
             <button onClick={handleUrlPublish} className="w-full bg-gray-900 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-yeonji transition-all">Connect URL</button>
          </div>
        )}

        {activeTab && activeTab !== 'link' && (
          <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-10 shadow-2xl animate-fade-up border border-gray-100 relative overflow-hidden">
            {!cloudUrl && !isCloudUploading ? (
              <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-gray-100 rounded-[2.5rem] p-16 text-center cursor-pointer hover:border-yeonji/30 transition-all bg-gray-50/30">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                <span className="text-4xl mb-6 block">📂</span>
                <h4 className="text-2xl font-black mb-2">파일 선택</h4>
                <p className="text-gray-400 text-sm">S3 Cloud 영구 보관용 업로드</p>
              </div>
            ) : isCloudUploading ? (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-yeonji border-t-transparent rounded-full animate-spin mb-6" />
                <p className="font-black text-gray-900 uppercase tracking-widest text-xs">Uploading to Storage...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">✅</div>
                  <h5 className="text-xl font-black truncate">{fileName}</h5>
                </div>
                <button onClick={handlePublish} className="w-full bg-gray-900 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-yeonji transition-all">Confirm & Publish</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
