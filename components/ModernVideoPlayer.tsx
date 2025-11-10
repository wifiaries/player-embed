'use client';

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './ModernVideoPlayer.css';

interface ModernVideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
}

export default function ModernVideoPlayer({ src, poster, autoplay = false }: ModernVideoPlayerProps) {
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
        playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'playbackRateMenuButton',
            'pictureInPictureToggle',
            'fullscreenToggle',
          ],
        },
        sources: [{
          src: src,
          type: 'video/mp4'
        }]
      });

      player.addClass('vjs-modern-skin');
      playerRef.current = player;

      player.ready(function() {
        console.log('Player is ready');
        injectCustomIcons(player);
      });

      // Update icons on play/pause
      player.on('play', () => updatePlayIcon(player, false));
      player.on('pause', () => updatePlayIcon(player, true));
      player.on('volumechange', () => updateVolumeIcon(player));
      player.on('fullscreenchange', () => updateFullscreenIcon(player));

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

  const injectCustomIcons = (player: any) => {
    // Play/Pause Button
    const playButton = player.controlBar.playToggle.el();
    const playIcon = playButton.querySelector('.vjs-icon-placeholder');
    if (playIcon) {
      playIcon.innerHTML = '';
      const iconContainer = document.createElement('div');
      iconContainer.className = 'custom-icon-play';
      playIcon.appendChild(iconContainer);
      updatePlayIcon(player, player.paused());
    }

    // Volume Button
    const muteButton = player.controlBar.volumePanel.muteToggle.el();
    const muteIcon = muteButton.querySelector('.vjs-icon-placeholder');
    if (muteIcon) {
      muteIcon.innerHTML = '';
      const iconContainer = document.createElement('div');
      iconContainer.className = 'custom-icon-volume';
      muteIcon.appendChild(iconContainer);
      updateVolumeIcon(player);
    }

    // PiP Button
    const pipButton = player.controlBar.pictureInPictureToggle?.el();
    if (pipButton) {
      const pipIcon = pipButton.querySelector('.vjs-icon-placeholder');
      if (pipIcon) {
        pipIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 11V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><rect width="8" height="5" x="13" y="15" rx="1"/></svg>';
      }
    }

    // Fullscreen Button
    const fsButton = player.controlBar.fullscreenToggle.el();
    const fsIcon = fsButton.querySelector('.vjs-icon-placeholder');
    if (fsIcon) {
      fsIcon.innerHTML = '';
      const iconContainer = document.createElement('div');
      iconContainer.className = 'custom-icon-fullscreen';
      fsIcon.appendChild(iconContainer);
      updateFullscreenIcon(player);
    }
  };

  const updatePlayIcon = (player: any, isPaused: boolean) => {
    const playButton = player.controlBar.playToggle.el();
    const iconContainer = playButton.querySelector('.custom-icon-play');
    if (iconContainer) {
      iconContainer.innerHTML = isPaused 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    }
  };

  const updateVolumeIcon = (player: any) => {
    const muteButton = player.controlBar.volumePanel.muteToggle.el();
    const iconContainer = muteButton.querySelector('.custom-icon-volume');
    if (iconContainer) {
      const vol = player.volume();
      const muted = player.muted();
      
      if (muted || vol === 0) {
        iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
      } else if (vol < 0.3) {
        iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg>';
      } else if (vol < 0.7) {
        iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
      } else {
        iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
      }
    }
  };

  const updateFullscreenIcon = (player: any) => {
    const fsButton = player.controlBar.fullscreenToggle.el();
    const iconContainer = fsButton.querySelector('.custom-icon-fullscreen');
    if (iconContainer) {
      const isFs = player.isFullscreen();
      iconContainer.innerHTML = isFs
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
    }
  };

  return (
    <div data-vjs-player className="w-full h-full modern-video-container">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered w-full h-full"
        playsInline
      ></video>
    </div>
  );
}