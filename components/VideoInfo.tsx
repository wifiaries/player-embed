'use client';

import React from 'react';
import { Eye, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';
import { formatViewCount, formatDate } from '@/lib/utils';
import type { Video } from '@/lib/types';

interface VideoInfoProps {
  video: Video;
}

export default function VideoInfo({ video }: VideoInfoProps) {
  return (
    <div className="p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold mb-2">{video.title}</h1>
      
      <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-3">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{formatViewCount(video.view_count)} views</span>
        </div>
        
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          <span>{formatViewCount(video.likes)}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <ThumbsDown className="w-4 h-4" />
          <span>{formatViewCount(video.dislikes)}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(video.upload_date)}</span>
        </div>
      </div>

      {video.description && (
        <p className="text-sm text-gray-400 line-clamp-3">
          {video.description}
        </p>
      )}
    </div>
  );
}