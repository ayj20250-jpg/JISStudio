
export interface BrandStoryRequest {
  keywords: string;
  tone: 'professional' | 'warm' | 'minimalist' | 'energetic';
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Folder {
  id: string;
  name: string;
  type: 'photo' | 'video' | 'audio' | 'document' | 'all';
  timestamp: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string; 
  contentSrc?: string; 
  fileData?: Blob | File; 
  type: 'photo' | 'video' | 'audio' | 'document' | 'link';
  folderId?: string;
  timestamp: number;
  isExternal?: boolean; // 외부 링크 여부
}
