'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  videoUrl: string;
  title: string;
}

export default function DownloadButton({ videoUrl, title }: DownloadButtonProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `${title}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
    >
      <Download className="w-5 h-5" />
      Download Video
    </button>
  );
}