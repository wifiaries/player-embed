import React from 'react';
import type { Metadata } from 'next';

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Watch Video ${id}`,
    description: 'Watch video in high quality',
    robots: 'noindex, nofollow',
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  
  // Gunakan /ej untuk container dengan ads
  const embedUrl = `/ej/${id}`;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        {/* Video Player iframe - Embed /ej */}
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              title={`Video ${id}`}
            />
          </div>
        </div>

        {/* Simple Info */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Video Player Test</h1>
          <p className="text-gray-400">Video ID: {id}</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Embed URL: {embedUrl}</p>
            <p className="mt-2">This iframe contains: StreamVid + Watermark + Ads</p>
          </div>
        </div>

        {/* Embed Code untuk website lain */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-3">Embed Code</h2>
          <p className="text-gray-400 text-sm mb-3">Copy this to embed on other websites:</p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400 text-sm break-all">
              {`<iframe src="${process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000'}${embedUrl}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}