
import React from 'react';

interface Props {
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SyncSection: React.FC<Props> = ({ onExport, onImport }) => {
  return (
    <section id="sync" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yeonji/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-yeonji font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Archive Sync Guide</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
                PC에서 올린 자산을<br/>모바일에서 확인하려면?
              </h2>
              <div className="space-y-4 text-gray-400 text-sm md:text-base font-light leading-relaxed mb-10">
                <p>
                  <strong className="text-white">기기 간 연동 안내:</strong> 현재 아카이브는 보안과 속도를 위해 사용자 기기(브라우저)에만 직접 저장됩니다. 
                  기기를 옮기고 싶다면 백업 기능을 활용하세요.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-yeonji font-black">1.</span>
                    <span className="text-xs">PC 연지스에서 '아카이브 백업'을 눌러 JSON 파일을 만듭니다.</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-yeonji font-black">2.</span>
                    <span className="text-xs">해당 파일을 모바일로 전송(카카오톡, 메일 등)합니다.</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-yeonji font-black">3.</span>
                    <span className="text-xs">모바일 연지스에서 '데이터 불러오기'로 파일을 선택합니다.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col gap-4">
              <h3 className="text-white text-lg font-black mb-4 uppercase tracking-widest text-center">Data Mobility</h3>
              
              <button 
                onClick={onExport}
                className="w-full bg-yeonji text-white py-5 rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-yeonji/20"
              >
                <span>📤</span> 아카이브 백업하기 (Export)
              </button>

              <label className="w-full bg-white/10 text-white py-5 rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-3 cursor-pointer">
                <input type="file" accept=".json" onChange={onImport} className="hidden" />
                <span>📥</span> 데이터 불러오기 (Import)
              </label>

              <div className="mt-4 p-4 text-center">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                  * 백업 파일은 이미지/영상 등의 영구 HTTPS 주소를 포함하고 있어 기기 변경 시에도 즉시 복구됩니다.
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
