import React from 'react';
import VideoPlayerWithAds from '@/components/VideoPlayerWithAds';
import HilltopAdsPopunder from '@/components/HilltopAdsPopunder';
import { getVideoById } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

interface EmbedPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmbedPage({ params, searchParams }: EmbedPageProps) {
  const { id } = await params;
  const { autoplay } = await searchParams;

  const video = await getVideoById(id);

  if (!video) {
    notFound();
  }

  const shouldAutoplay = autoplay === 'true' || autoplay === '1';

  return (
    <>
      {/* HilltopAds Popunder - Client Component */}
      <HilltopAdsPopunder />

      <div className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center">
        <div className="w-full h-full">
          <VideoPlayerWithAds
            src={video.video_url}
            poster={video.thumbnail_url || undefined}
            autoplay={shouldAutoplay}
          />
        </div>
      </div>
    </>
  );
}
