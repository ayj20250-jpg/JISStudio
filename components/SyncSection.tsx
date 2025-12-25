
import React, { useState, useEffect } from 'react';

const SyncSection: React.FC = () => {
  const [syncKey, setSyncKey] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 기존에 생성된 키가 있는지 확인
    const savedKey = localStorage.getItem('yeonjis_sync_key');
    if (savedKey) {
      setSyncKey(savedKey);
      setIsGenerated(true);
      setIsConnected(true);
    }
  }, []);

  const generateKey = () => {
    const newKey = 'YJ-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setSyncKey(newKey);
    localStorage.setItem('yeonjis_sync_key', newKey);
    setIsGenerated(true);
    setIsConnected(true);
  };

  const handleConnect = () => {
    if (!inputKey) return;
    
    // 사용자의 요청에 따라 지연 시간 없이 즉시 연동 처리
    setIsConnecting(true);
    
    // 로컬 스토리지에 키 저장 및 상태 업데이트
    localStorage.setItem('yeonjis_sync_key', inputKey);
    setSyncKey(inputKey);
    setIsGenerated(true);
    
    // 짧은 시각적 피드백 후 완료 처리 (snappy UX)
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      // 실제 환경에서는 여기서 서버와 데이터를 동기화하는 로직이 들어갑니다.
    }, 300);
  };

  const handleDisconnect = () => {
    if (confirm('연동을 해제하시겠습니까? 로컬 데이터는 유지되지만 동기화가 중단됩니다.')) {
      localStorage.removeItem('yeonjis_sync_key');
      setSyncKey('');
      setIsGenerated(false);
      setIsConnected(false);
      setInputKey('');
    }
  };

  return (
    <section id="connect" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gray-900 rounded-[4rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yeonji/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-yeonji font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Multi-Device Sync</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-[1.1]">
                {isConnected ? '보관소가 연결되었습니다.' : 'PC와 모바일을\n하나의 보관소로.'}
              </h2>
              <p className="text-gray-400 text-lg mb-12 font-light leading-relaxed">
                {isConnected 
                  ? '현재 기기가 클라우드 보관소와 동기화 중입니다. 모든 자산이 실시간으로 공유됩니다.' 
                  : '생성된 고유 키를 모바일에서 입력하면, PC에서 올린 자산을 어디서든 자유롭게 열람하고 관리할 수 있습니다.'}
              </p>
              
              {!isGenerated ? (
                <button 
                  onClick={generateKey}
                  className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-black text-sm hover:bg-yeonji hover:text-white transition-all transform active:scale-95 shadow-xl"
                >
                  보관소 동기화 키 생성하기
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl inline-block">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">My Vault Key</p>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-black text-yeonji tracking-wider">{syncKey}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(syncKey);
                          alert('복사되었습니다.');
                        }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all group relative"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Active Connection</span>
                    </div>
                    <button 
                      onClick={handleDisconnect}
                      className="text-red-400 text-[10px] font-bold uppercase tracking-widest hover:underline"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-inner relative">
              {isConnected && !isConnecting && (
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm rounded-[3rem] z-20 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                  <div className="w-16 h-16 bg-yeonji rounded-full flex items-center justify-center text-3xl mb-4 shadow-2xl shadow-yeonji/20">✅</div>
                  <h4 className="text-white text-xl font-black mb-2">연동 완료</h4>
                  <p className="text-gray-400 text-sm">보관소 {syncKey}와 연결되었습니다.</p>
                  <button 
                    onClick={() => setIsConnected(false)}
                    className="mt-6 text-gray-500 text-xs hover:text-white transition-colors underline"
                  >
                    다른 키 입력하기
                  </button>
                </div>
              )}

              <h3 className="text-white text-xl font-black mb-8">기기 연동하기</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Enter Vault Key</label>
                  <input 
                    type="text" 
                    placeholder="예: YJ-A1B2C3D4"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white font-black tracking-widest focus:border-yeonji outline-none transition-all placeholder:text-gray-700"
                  />
                </div>
                
                <button 
                  onClick={handleConnect}
                  disabled={isConnecting || !inputKey}
                  className="w-full bg-yeonji text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-yeonji/30 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>연동 중...</span>
                    </>
                  ) : '지금 연동하기'}
                </button>
              </div>

              <div className="mt-12 flex items-center gap-6 p-6 bg-white/5 rounded-2xl">
                <div className="w-12 h-12 bg-yeonji/20 rounded-xl flex items-center justify-center text-2xl">📱</div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  <strong className="text-white">모바일 팁:</strong> 모바일 브라우저에서 '홈 화면에 추가'를 하시면 앱처럼 더 편리하게 연동된 자산을 확인하실 수 있습니다.
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
