import React from 'react';
import StreamVidIframe from '@/components/StreamVidframe';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    videoId: string;
  }>;
  searchParams: Promise<{
    autoplay?: string;
    watermark?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { videoId } = await params;
  
  return {
    robots: 'noindex, nofollow',
    title: `Video ${videoId} - StreamVid Player`,
  };
}

export default async function VideoPage({ params, searchParams }: PageProps) {
  const { videoId } = await params;
  const { autoplay, watermark, position } = await searchParams;
  
  const shouldAutoplay = autoplay === '1' || autoplay === 'true';
  const watermarkText = watermark || 'BAGIBAGI.COM';
  const watermarkPosition = position || 'bottom-right';
  
  return (
    <StreamVidIframe 
      videoId={videoId} 
      autoplay={shouldAutoplay}
      watermark={watermarkText}
      watermarkPosition={watermarkPosition}
    />
  );
}