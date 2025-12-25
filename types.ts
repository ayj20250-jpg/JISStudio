
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
  type: 'photo' | 'video' | 'audio' | 'document';
  folderId?: string; // 소속된 폴더 ID
  timestamp: number;
}
