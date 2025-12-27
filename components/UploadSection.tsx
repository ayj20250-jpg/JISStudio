
import React, { useState, useRef } from 'react';
import { GalleryItem } from '../types';
import { uploadFileToCloud } from '../services/apiService';

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
  const [isCloudUploading, setIsCloudUploading] = useState(false);
  const [cloudUrl, setCloudUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileObject, setFileObject] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileObject(file);
      setIsCloudUploading(true);
      
      try {
        // 1. 클라우드 서버(S3/CDN)에 업로드하고 영구 HTTPS URL 획득
        const persistentUrl = await uploadFileToCloud(file);
        setCloudUrl(persistentUrl);
      } catch (error) {
        alert("클라우드 업로드에 실패했습니다.");
        console.error(error);
      } finally {
        setIsCloudUploading(false);
      }
    }
  };

  const handlePublish = () => {
    if (!activeTab || !fileName || !cloudUrl) {
      alert("업로드 중이거나 파일이 선택되지 않았습니다.");
      return;
    }

    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: fileName.split('.')[0] || 'Untitled Project',
      category: categories.find(c => c.id === activeTab)?.title || '기타',
      // 이미지인 경우 클라우드 URL을 그대로 사용, 아니면 기본 썸네일
      image: activeTab === 'photo' ? cloudUrl : 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80',
      contentSrc: cloudUrl, // 전 기기 공통 사용 가능한 HTTPS URL
      type: activeTab as any,
      timestamp: Date.now()
    };

    onPublish(newItem);
    
    // 상태 초기화
    setActiveTab(null);
    setCloudUrl(null);
    setFileObject(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div id="upload-section" className="py-24 md:py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-yeonji font-black tracking-[0.5em] uppercase text-[10px] mb-4 block">Archive Center</span>
          <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">CLOUD UPLOAD</h2>
          <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">
            Persistent HTTPS Storage • Public-Read Access
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
                setCloudUrl(null);
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
            
            {!cloudUrl && !isCloudUploading ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-4 border-dashed border-gray-100 rounded-[2.5rem] md:rounded-[3rem] p-12 md:p-24 text-center cursor-pointer hover:border-yeonji/30 transition-all bg-gray-50/30 group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-all">
                  <span className="text-3xl md:text-4xl">🌍</span>
                </div>
                <h4 className="text-2xl md:text-3xl font-black mb-3">클라우드에 올리기</h4>
                <p className="text-gray-400 text-xs md:text-base font-medium px-4">
                  S3/CDN 서버에 직접 보관되어 모든 기기에서 즉시 확인 가능합니다.
                </p>
              </div>
            ) : isCloudUploading ? (
              <div className="py-24 text-center flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-yeonji border-t-transparent rounded-full animate-spin mb-8" />
                <p className="font-black text-gray-900 uppercase tracking-[0.3em] text-[10px]">Cloud Synching...</p>
                <p className="text-gray-400 text-[9px] mt-2 font-bold uppercase tracking-widest">Generating Public HTTPS URL</p>
              </div>
            ) : (
              <div className="space-y-10 animate-fade-in">
                <div className="bg-gray-50 p-8 md:p-10 rounded-[2.5rem] border border-gray-100">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                      ✅
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-1">Upload Complete</p>
                      <h5 className="text-xl md:text-2xl font-black truncate text-gray-900">{fileName}</h5>
                    </div>
                  </div>
                  
                  {activeTab === 'photo' && cloudUrl && (
                    <div className="mb-8 rounded-3xl overflow-hidden border border-gray-200 shadow-sm aspect-video">
                      <img src={cloudUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Public CDN URL</p>
                    <code className="text-[10px] text-yeonji truncate font-mono">{cloudUrl}</code>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => { setCloudUrl(null); setFileObject(null); }}
                    className="flex-1 bg-gray-100 text-gray-500 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all transform active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePublish}
                    className="flex-[2.5] bg-gray-900 text-white py-6 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest hover:bg-yeonji transition-all shadow-2xl shadow-gray-200 transform active:scale-95"
                  >
                    Confirm & Publish
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
