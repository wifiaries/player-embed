'use client';

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
}

export default function VideoPlayer({ src, poster, autoplay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = videoRef.current;

      const player = videojs(videoElement, {
        controls: true,
        autoplay: autoplay,
        preload: 'metadata',
        fluid: true,
        responsive: true,
        aspectRatio: '16:9',
        poster: poster,
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        sources: [{
          src: src,
          type: 'video/mp4'
        }]
      });

      playerRef.current = player;

      player.ready(function() {
        console.log('Player is ready');
      });

      player.on('error', function() {
        console.error('Player error:', player.error());
      });
    }

    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, autoplay]);

  return (
    <div data-vjs-player className="w-full h-full">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered w-full h-full"
        playsInline
      ></video>
    </div>
  );
}