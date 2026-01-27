
import React from 'react';

interface Props {
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SyncSection: React.FC<Props> = ({ onExport, onImport }) => {
  return (
    <section id="connect" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yeonji/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-yeonji font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Archive Migration</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
                PC에서 올린 자산을<br/>모바일에서 확인하려면?
              </h2>
              <div className="space-y-4 text-gray-400 text-sm md:text-base font-light leading-relaxed mb-10">
                <p>
                  <strong className="text-white">알림:</strong> 현재 연지스 아카이브는 보안을 위해 사용자 기기(IndexedDB)에만 영구 저장됩니다. 
                  기기 간 동기화를 원하시면 아래 백업 파일을 생성하여 모바일로 전달해 주세요.
                </p>
                <ul className="list-disc pl-5 space-y-2 opacity-80">
                  <li>PC에서 '아카이브 백업' 클릭 (JSON 파일 생성)</li>
                  <li>생성된 파일을 카카오톡/이메일로 모바일에 전송</li>
                  <li>모바일 연지스에서 '데이터 불러오기'로 파일 선택</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col gap-4">
              <h3 className="text-white text-lg font-black mb-4 uppercase tracking-widest">Device Migration Tools</h3>
              
              <button 
                onClick={onExport}
                className="w-full bg-yeonji text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center gap-3"
              >
                <span>📤</span> 아카이브 백업하기 (Export)
              </button>

              <label className="w-full bg-white/10 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-3 cursor-pointer">
                <input type="file" accept=".json" onChange={onImport} className="hidden" />
                <span>📥</span> 데이터 불러오기 (Import)
              </label>

              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                  * 백업 파일은 모든 사진, 동영상, 문서의 클라우드 주소를 포함하고 있어 기기에 상관없이 즉시 복구됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SyncSection;
