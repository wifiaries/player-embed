export interface Video {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    video_url: string;
    thumbnail_url: string | null;
    duration: string | null;
    view_count: number;
    likes: number;
    dislikes: number;
    is_published: boolean;
    upload_date: string;
    created_at: string;
    meta_title: string | null;
    meta_description: string | null;
    keywords: string[] | null;
    status_bing: string | null;
    status_wp: string | null;
    user_id: string | null;
  }
  
  export interface VideoResponse {
    success: boolean;
    data?: Video;
    error?: string;
  }