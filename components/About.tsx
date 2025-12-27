
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-yeonji font-bold tracking-widest uppercase text-sm mb-4 block">연지스 소개</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              당신의 기록을<br />예술로 만드는 공간
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                연지스(Yeonjis)는 단순한 데이터 보관 이상의 가치를 지향합니다. 
                흩어져 있는 당신의 자산들을 하나의 완성된 스토리로 엮어냅니다.
              </p>
              <p>
                PC와 모바일, 어떤 환경에서도 당신의 미디어가 가장 아름답게 보일 수 있도록 
                최적의 뷰잉 환경을 제공하며 영구적인 디지털 아카이브를 구축합니다.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-200">
              {/* index.html 기준 assets 폴더 내의 이미지를 불러오는 상대 경로 설정 */}
              <img 
                src="./assets/about-img.jpg" 
                alt="Yeonjis Philosophy" 
                className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl hidden md:block border border-gray-100 max-w-xs">
              <p className="italic text-gray-700 font-medium text-sm">
                "가장 가볍게 시작해서 가장 무거운 결실을 맺습니다."
              </p>
              <p className="mt-4 text-[10px] font-black text-yeonji uppercase tracking-widest">— Yeonjis Studio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
