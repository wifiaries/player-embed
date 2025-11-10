import React from 'react';
import { getVideoById } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Eye, ThumbsUp, Calendar, Clock } from 'lucide-react';
import DownloadButton from '@/components/DownloadButton';
import { formatViewCount, formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

interface DownloadPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DownloadPageProps): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    return {
      title: 'Video Not Found',
    };
  }

  return {
    title: `Download ${video.title}`,
    description: video.description || `Download ${video.title} - High quality video`,
    keywords: video.keywords || undefined,
    openGraph: {
      title: video.title,
      description: video.description || undefined,
      images: video.thumbnail_url ? [video.thumbnail_url] : undefined,
    },
  };
}

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    notFound();
  }

  const embedUrl = `/e/${id}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4">
        {/* Video Player iframe */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            />
          </div>
        </div>

        {/* Video Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{video.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{formatViewCount(video.view_count)} views</span>
            </div>
            
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              <span>{formatViewCount(video.likes)} likes</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(video.upload_date)}</span>
            </div>

            {video.duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{video.duration}</span>
              </div>
            )}
          </div>

          {video.description && (
            <div className="border-t pt-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
            </div>
          )}
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Download Video</h2>
          <p className="text-gray-600 mb-4">
            Click the button below to download this video in high quality MP4 format.
          </p>
          <DownloadButton videoUrl={video.video_url} title={video.title} />
        </div>

        {/* Embed Code Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Embed Code</h2>
          <p className="text-gray-600 mb-3">Copy and paste this code to embed the video on your website:</p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm">
              {`<iframe src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://stream.bagibagi.com'}${embedUrl}" width="100%" height="500" frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}