'use client';

import React from 'react';

interface StreamVidIframeProps {
  videoId: string;
  autoplay?: boolean;
  watermark?: string;
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export default function StreamVidIframe({ 
  videoId, 
  autoplay = false,
  watermark = 'BAGIBAGI.COM',
  watermarkPosition = 'bottom-right'
}: StreamVidIframeProps) {
  // Konstruksi URL iframe dari StreamVid
  const iframeSrc = `https://streamvid.dev/te/${videoId}${autoplay ? '?autoplay=1' : ''}`;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className="fixed inset-0 bg-black">
      <iframe
        src={iframeSrc}
        className="w-full h-full"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
      
      {/* Watermark Overlay */}
      {watermark && (
        <div 
          className={`fixed ${positionClasses[watermarkPosition]} z-50 pointer-events-none select-none`}
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <span className="text-white/90 text-sm font-semibold tracking-wide">
              {watermark}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}