
/**
 * yeonjis-project/services/apiService.ts
 * 
 * 공용 아카이브 및 클라우드 스토리지(S3/Firebase/CDN) 인터랙션을 처리합니다.
 */

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

// 클라우드 업로드 시뮬레이션 (AWS S3 / Firebase Storage 연동 지점)
export const uploadFileToCloud = async (file: File): Promise<string> => {
  console.log(`--- Uploading to Cloud Storage (S3/Firebase) ---`);
  console.log(`File: ${file.name}, Size: ${file.size}, Type: ${file.type}`);
  
  // 실제 환경에서는 여기서 S3 SDK나 Firebase SDK를 사용하여 업로드합니다.
  // 예: const ref = storage.ref(`assets/${Date.now()}_${file.name}`);
  //     await ref.put(file, { contentType: file.type, cacheControl: 'public,max-age=31536000' });
  //     return await ref.getDownloadURL();
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // 네트워크 지연 시뮬레이션

  // 시뮬레이션을 위해 이미지인 경우 Unsplash 랜덤 혹은 Base64 변환 URL을 반환하거나,
  // 실제 배포 환경이라고 가정하고 영구 접근 가능한 HTTPS URL 형식을 생성합니다.
  
  // 여기서는 데모를 위해 고유한 해시가 포함된 Mock CDN URL을 생성합니다.
  const fileHash = Math.random().toString(36).substring(7);
  const extension = file.name.split('.').pop();
  
  // 이미지 파일인 경우 브라우저에서 즉시 볼 수 있도록 DataURL로 임시 변환하여 
  // 영구 URL처럼 시뮬레이션합니다 (실제 S3 URL 역할을 대신함).
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // 실제 프로젝트에서는 "https://cdn.yeonjis.com/uploads/..." URL이 반환되어야 합니다.
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

// 공용 데이터 시뮬레이션 (HTTPS URL 기반)
const MOCK_PUBLIC_ASSETS = [
  {
    id: 'public-1',
    title: 'Yeonjis Brand Movie',
    category: '브랜딩',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    contentSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', // 실제 CDN 영상 URL
    type: 'video',
    timestamp: Date.now() - 86400000 * 2,
    isPublic: true
  },
  {
    id: 'public-2',
    title: 'Archive System Plan v1.2',
    category: '기획서',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    contentSrc: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // 실제 CDN 문서 URL
    type: 'document',
    timestamp: Date.now() - 86400000 * 5,
    isPublic: true
  },
  {
    id: 'public-3',
    title: 'Eternal Peaks Photography',
    category: '미디어',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    contentSrc: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80',
    type: 'photo',
    timestamp: Date.now() - 86400000 * 1,
    isPublic: true
  }
];

export const getPublicArchive = async (): Promise<any[]> => {
  console.log('--- Fetching Global Archive via HTTPS ---');
  await new Promise(resolve => setTimeout(resolve, 1000));
  return MOCK_PUBLIC_ASSETS;
};

export const uploadToPublicArchive = async (item: any): Promise<boolean> => {
  console.log('--- Synchronizing Metadata with Cloud Database ---');
  // HTTPS URL이 포함된 메타데이터를 DB에 저장
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};

export const submitContactForm = async (data: ContactData): Promise<{ status: string; message: string }> => {
  console.log('--- Form Submission via API ---');
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { status: 'success', message: '메시지가 성공적으로 백엔드에 전달되었습니다.' };
};
