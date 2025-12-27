
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
    <div id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white py-20 md:py-0">
      {/* Background Layer with Parallax */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-1000 ease-out"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px) scale(1.15)`
        }}
      />
      
      {/* Overlay Gradients for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/60 z-[1]" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-[1]" />
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl flex flex-col items-center">
        <div className="inline-block mb-8 md:mb-12 px-6 py-2 border border-white/20 rounded-full bg-white/10 backdrop-blur-xl animate-fade-in shadow-xl shadow-black/5">
          <span className="text-gray-900 text-[10px] font-black tracking-[0.6em] uppercase">The Purest Archive</span>
        </div>
        
        <div className="relative mb-8 md:mb-12">
          {/* Subtle Glow behind text */}
          <div className="absolute -inset-10 bg-white/20 blur-[100px] rounded-full z-0" />
          
          <h1 className="relative z-10 tracking-tighter leading-[0.85] overflow-hidden">
            <span className="block text-4xl md:text-6xl font-extralight text-gray-700 mb-2 lowercase tracking-tight opacity-0 animate-[slideUp_1s_ease-out_0.2s_forwards]">
              as pure as,
            </span>
            <span className="block text-6xl md:text-[11rem] font-black text-gray-900 -mt-2 md:-mt-6 uppercase opacity-0 animate-[slideUp_1s_ease-out_0.4s_forwards]">
              eternal<br/>peaks.
            </span>
          </h1>
        </div>
        
        <p className="text-base md:text-2xl text-gray-700 mb-12 md:mb-16 font-medium max-w-2xl mx-auto leading-relaxed tracking-tight opacity-0 animate-[slideUp_1s_ease-out_0.6s_forwards]">
          변하지 않는 설산의 침묵처럼,<br /> 
          당신의 소중한 데이터는 이곳에서 영원히 빛납니다.
        </p>
        
        {/* Welcome Message Section - Adjusted for visibility */}
        <div className="opacity-0 animate-[slideUp_1s_ease-out_0.8s_forwards] flex flex-col items-center w-full">
          <div className="h-[1px] w-16 md:w-24 bg-gray-900/20 mb-6 md:mb-8" />
          <div className="px-4 py-6 md:py-8 bg-white/30 backdrop-blur-md rounded-[2rem] border border-white/50 shadow-2xl shadow-black/5 w-full max-w-lg">
            <h3 className="text-xl md:text-4xl font-black text-gray-900 tracking-tighter leading-snug">
              연지의 홈페이지에<br className="md:hidden" /> 오신 것을 환영합니다.
            </h3>
            <p className="text-[9px] md:text-[10px] font-bold text-yeonji uppercase tracking-[0.4em] mt-3 md:mt-4 opacity-70">
              Welcome to Yeonji's Archive
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Positioned with relative safe area */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-40 hidden sm:block">
        <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-gray-900 to-transparent mx-auto" />
      </div>
    </div>
  );
};

export default Hero;
