
import React, { useState, useEffect } from 'react';

interface Props {
  onUploadClick: () => void;
}

const Hero: React.FC<Props> = ({ onUploadClick }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#f0f4f7]">
      {/* 
        서버 배포 시 미디어가 보이도록 하려면 반드시 index.html 기준의 상대 경로를 사용해야 합니다.
        사용자님의 assets 폴더 안에 hero-bg.jpg 가 있다고 가정하고 경로를 설정합니다.
      */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-1000 ease-out scale-110"
        style={{ 
          // 상대 경로: ./assets/파일명 형식
          backgroundImage: "url('./assets/hero-bg.jpg')", 
          // 파일이 없는 경우를 대비한 대체 이미지 (배포 시 삭제 가능)
          backgroundColor: '#1a1a1a', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px) scale(1.1)`
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/10 to-transparent z-1" />
      
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="inline-block mb-12 px-6 py-2 border border-black/5 rounded-full bg-white/20 backdrop-blur-2xl animate-fade-in shadow-sm">
          <span className="text-gray-400 text-[9px] font-bold tracking-[0.6em] uppercase">Premium Asset Archive</span>
        </div>
        
        <h1 className="mb-12 animate-fade-up tracking-tighter leading-[0.9]">
          <span className="block text-4xl md:text-6xl font-extralight text-gray-400 mb-2 lowercase tracking-normal">Lightly,</span>
          <span className="block text-7xl md:text-[10rem] font-black text-gray-900 -mt-2 md:-mt-6 uppercase">but heavy.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-16 font-light max-w-xl mx-auto leading-relaxed tracking-tight">
          당신의 모든 순간을 깃털처럼 가볍게 기록하고,<br /> 
          바위처럼 묵직한 가치로 보관하는 연지스 스튜디오입니다.
        </p>
        
        <div className="flex justify-center items-center">
          <button 
            onClick={onUploadClick}
            className="group relative bg-gray-900 hover:bg-yeonji text-white px-14 py-5 rounded-2xl font-black text-sm transition-all shadow-2xl flex items-center gap-4 overflow-hidden"
          >
            <span className="relative z-10 uppercase tracking-widest">지금 업로드하기</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
