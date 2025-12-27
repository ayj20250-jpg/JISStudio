
import React, { useState, useEffect } from 'react';

interface Props {
  onUploadClick: () => void;
}

const Navbar: React.FC<Props> = ({ onUploadClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-white/90 backdrop-blur-2xl shadow-sm py-4 border-b border-gray-100' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={scrollToTop}
          className={`text-xl md:text-2xl font-black tracking-tighter cursor-pointer transition-all duration-500 ${isScrolled ? 'text-yeonji' : 'text-gray-900 md:text-white'}`}
        >
          YEONJIS<span className="text-yeonji">.</span>
        </div>
        
        {/* Navigation Actions (Right Side) */}
        <div className="flex items-center space-x-4 md:space-x-10">
          <button
            onClick={scrollToTop}
            className={`text-[13px] md:text-[14px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5 ${isScrolled ? 'text-gray-600 hover:text-yeonji' : 'text-gray-900 md:text-gray-200/90 hover:text-white'}`}
          >
            홈
          </button>
          
          <button 
            onClick={onUploadClick}
            className={`px-5 md:px-10 py-2.5 md:py-3.5 rounded-2xl text-[13px] md:text-[14px] font-black uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
              isScrolled 
              ? 'bg-gray-900 text-white shadow-gray-200' 
              : 'bg-white text-gray-900 shadow-white/10'
            }`}
          >
            업로드
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
