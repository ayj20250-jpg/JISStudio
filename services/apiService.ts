
/**
 * yeonjis-project/services/apiService.ts
 * 
 * 공용 아카이브 및 백엔드 인터랙션을 시뮬레이션합니다.
 */

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

// 공용 데이터 시뮬레이션 (초기 방문 시 보여줄 샘플)
const MOCK_PUBLIC_ASSETS = [
  {
    id: 'public-1',
    title: 'Yeonjis Brand Movie',
    category: '브랜딩',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    type: 'video',
    timestamp: Date.now() - 86400000 * 2,
    isPublic: true
  },
  {
    id: 'public-2',
    title: 'Archive System Plan v1.2',
    category: '기획서',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    type: 'document',
    timestamp: Date.now() - 86400000 * 5,
    isPublic: true
  },
  {
    id: 'public-3',
    title: 'Minimalist Interior',
    category: '미디어',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    type: 'photo',
    timestamp: Date.now() - 86400000 * 1,
    isPublic: true
  }
];

export const getPublicArchive = async (): Promise<any[]> => {
  console.log('--- Fetching Global Archive from Cloud ---');
  await new Promise(resolve => setTimeout(resolve, 1200)); // 네트워크 지연 시뮬레이션
  return MOCK_PUBLIC_ASSETS;
};

export const uploadToPublicArchive = async (item: any): Promise<boolean> => {
  console.log('--- Publishing to Global Archive ---');
  console.log('Payload:', item);
  await new Promise(resolve => setTimeout(resolve, 1500));
  // 실제 환경에서는 여기서 API Post 요청을 보냅니다.
  return true;
};

export const submitContactForm = async (data: ContactData): Promise<{ status: string; message: string }> => {
  console.log('--- Submitting to Backend ---');
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { status: 'success', message: '메시지가 성공적으로 백엔드에 전달되었습니다.' };
};
