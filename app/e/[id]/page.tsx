import React from 'react';
import ModernVideoPlayer from '@/components/ModernVideoPlayer';
import AdsterraPopunder from '@/components/AdsterraPopunder';
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
      {/* Adsterra Popunder - Client Component */}
      <AdsterraPopunder />

      <div className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center">
        <div className="w-full h-full">
          <ModernVideoPlayer
            src={video.video_url}
            poster={video.thumbnail_url || undefined}
            autoplay={shouldAutoplay}
          />
        </div>
      </div>
    </>
  );
}