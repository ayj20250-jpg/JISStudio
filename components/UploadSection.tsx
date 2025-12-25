
import React, { useState, useRef } from 'react';
import { GalleryItem } from '../types';

interface UploadSectionProps {
  onPublish: (item: GalleryItem) => void;
}

const categories = [
  { id: 'photo', title: '사진', desc: '4K+, Raw Support', icon: '📸' },
  { id: 'video', title: '영상', desc: 'MP4 / MOV High', icon: '🎬' },
  { id: 'audio', title: '음악', desc: 'MP3 / WAV Lossless', icon: '🎵' },
  { id: 'document', title: '문서', desc: 'PDF / Project Plan', icon: '📑' }
];

const UploadSection: React.FC<UploadSectionProps> = ({ onPublish }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setUploading(true);
      setFileObject(file);
      
      const objectUrl = URL.createObjectURL(file);
      
      setTimeout(() => {
        setPreview(objectUrl);
        setUploading(false);
      }, 600);
    }
  };

  const handlePublish = () => {
    if (!activeTab || !fileName || !fileObject) {
      alert("파일을 먼저 선택해주세요.");
      return;
    }

    const contentUrl = URL.createObjectURL(fileObject);

    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: fileName.split('.')[0] || 'Untitled Project',
      category: categories.find(c => c.id === activeTab)?.title || '기타',
      image: activeTab === 'photo' ? contentUrl : 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80',
      contentSrc: contentUrl,
      fileData: fileObject,
      type: activeTab as any,
      timestamp: Date.now()
    };

    onPublish(newItem);
    
    setActiveTab(null);
    setPreview(null);
    setFileObject(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div id="upload-section" className="py-24 md:py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-yeonji font-black tracking-[0.5em] uppercase text-[10px] mb-4 block">Archive Center</span>
          <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">UPLOAD</h2>
          <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">
            Persistent Local Storage & Cloud Sync Ready
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                setFileObject(null);
                setFileName('');
                setPreview(null);
              }}
              className={`p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border-2 transition-all duration-500 flex flex-col items-center justify-center text-center group transform ${
                activeTab === cat.id ? 'border-yeonji bg-white shadow-2xl scale-105' : 'border-transparent bg-white/40 hover:bg-white hover:scale-102'
              }`}
            >
              <span className="text-4xl md:text-5xl mb-4 md:mb-8 group-hover:rotate-12 transition-transform duration-500">{cat.icon}</span>
              <h3 className="text-base md:text-xl font-black mb-2">{cat.title}</h3>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">{cat.desc}</p>
            </button>
          ))}
        </div>

        {activeTab && (
          <div className="max-w-3xl mx-auto bg-white rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl animate-fade-up border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-yeonji" />
            
            {!fileObject && !uploading ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-4 border-dashed border-gray-100 rounded-[2.5rem] md:rounded-[3rem] p-12 md:p-24 text-center cursor-pointer hover:border-yeonji/30 transition-all bg-gray-50/30 group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept={
                    activeTab === 'photo' ? 'image/*' : 
                    activeTab === 'video' ? 'video/*' : 
                    activeTab === 'audio' ? 'audio/*' : '*'
                  }
                />
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-all">
                  <span className="text-3xl md:text-4xl">📥</span>
                </div>
                <h4 className="text-2xl md:text-3xl font-black mb-3">파일 선택하기</h4>
                <p className="text-gray-400 text-xs md:text-base font-medium px-4">
                  보관할 {categories.find(c => c.id === activeTab)?.title} 파일을 업로드 공간에 넣어주세요.
                </p>
              </div>
            ) : uploading ? (
              <div className="py-24 text-center flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-yeonji border-t-transparent rounded-full animate-spin mb-8" />
                <p className="font-black text-gray-900 uppercase tracking-[0.3em] text-xs">Processing Asset</p>
              </div>
            ) : (
              <div className="space-y-10 animate-fade-in">
                <div className="bg-gray-50 p-8 md:p-10 rounded-[2.5rem] border border-gray-100">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                      {categories.find(c => c.id === activeTab)?.icon}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-yeonji uppercase tracking-[0.2em] mb-1">Archive Ready</p>
                      <h5 className="text-xl md:text-2xl font-black truncate text-gray-900">{fileName}</h5>
                    </div>
                  </div>
                  
                  {activeTab === 'photo' && preview && (
                    <div className="mb-8 rounded-3xl overflow-hidden border border-gray-200 shadow-sm aspect-video">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-t border-gray-200 pt-8">
                    <span className="bg-white px-4 py-2 rounded-lg shadow-sm">Size: {(fileObject!.size / (1024 * 1024)).toFixed(2)} MB</span>
                    <span className="bg-white px-4 py-2 rounded-lg shadow-sm">Type: {fileObject!.type.split('/')[1] || 'Unknown'}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => { setFileObject(null); setPreview(null); }}
                    className="flex-1 bg-gray-100 text-gray-500 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all transform active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePublish}
                    className="flex-[2.5] bg-gray-900 text-white py-6 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest hover:bg-yeonji transition-all shadow-2xl shadow-gray-200 transform active:scale-95"
                  >
                    Publish to Vault
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
