'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './HilltopAdsPreroll.css';

interface HilltopAdsPrerollProps {
  onAdComplete: () => void;
  onAdSkipped?: () => void;
}

declare global {
  interface Window {
    google: {
      ima: {
        AdDisplayContainer: new (container: HTMLElement, video?: HTMLVideoElement) => ImaAdDisplayContainer;
        AdsLoader: new (container: ImaAdDisplayContainer) => ImaAdsLoader;
        AdsRequest: new () => ImaAdsRequest;
        AdsManagerLoadedEvent: {
          Type: {
            ADS_MANAGER_LOADED: string;
          };
        };
        AdErrorEvent: {
          Type: {
            AD_ERROR: string;
          };
        };
        AdEvent: {
          Type: {
            CONTENT_PAUSE_REQUESTED: string;
            CONTENT_RESUME_REQUESTED: string;
            ALL_ADS_COMPLETED: string;
            STARTED: string;
            COMPLETE: string;
            SKIPPED: string;
            LOADED: string;
          };
        };
        ViewMode: {
          NORMAL: string;
        };
      };
    };
  }
}

interface ImaAdDisplayContainer {
  initialize: () => void;
}

interface ImaAdsLoader {
  addEventListener: (event: string, handler: (e: unknown) => void, capture: boolean) => void;
  requestAds: (request: ImaAdsRequest) => void;
  contentComplete: () => void;
}

interface ImaAdsRequest {
  adTagUrl: string;
  linearAdSlotWidth: number;
  linearAdSlotHeight: number;
}

interface ImaAdsManager {
  addEventListener: (event: string, handler: (e: unknown) => void) => void;
  init: (width: number, height: number, viewMode: string) => void;
  start: () => void;
  destroy: () => void;
  resize: (width: number, height: number, viewMode: string) => void;
}

interface ImaAdsManagerLoadedEvent {
  getAdsManager: (content: { currentTime: number; duration: number }, settings?: object) => ImaAdsManager;
}

export default function HilltopAdsPreroll({ onAdComplete, onAdSkipped }: HilltopAdsPrerollProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [adPlaying, setAdPlaying] = useState(false);
  const [hasAd, setHasAd] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  const adContainerRef = useRef<HTMLDivElement>(null);
  const adVideoRef = useRef<HTMLVideoElement>(null);
  const adsLoaderRef = useRef<ImaAdsLoader | null>(null);
  const adsManagerRef = useRef<ImaAdsManager | null>(null);
  const adDisplayContainerRef = useRef<ImaAdDisplayContainer | null>(null);
  const initCalledRef = useRef(false);

  // Use the IMA-compatible VAST URL
  const vastUrl = process.env.NEXT_PUBLIC_HILLTOPADS_VAST_IMA || process.env.NEXT_PUBLIC_HILLTOPADS_VSAT;

  const destroyAdsManager = useCallback(() => {
    if (adsManagerRef.current) {
      adsManagerRef.current.destroy();
      adsManagerRef.current = null;
    }
  }, []);

  const skipToContent = useCallback(() => {
    destroyAdsManager();
    onAdComplete();
  }, [destroyAdsManager, onAdComplete]);

  const handleAdSkip = useCallback(() => {
    destroyAdsManager();
    onAdSkipped?.();
    onAdComplete();
  }, [destroyAdsManager, onAdComplete, onAdSkipped]);

  // Initialize IMA SDK
  useEffect(() => {
    if (initCalledRef.current) return;
    initCalledRef.current = true;

    // If no VAST URL, skip to content
    if (!vastUrl) {
      console.log('[HilltopAds] No VAST URL configured, skipping to content');
      skipToContent();
      return;
    }

    // Load IMA SDK script
    const script = document.createElement('script');
    script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
    script.async = true;

    script.onload = () => {
      console.log('[HilltopAds] IMA SDK loaded');
      initializeIMA();
    };

    script.onerror = () => {
      console.error('[HilltopAds] Failed to load IMA SDK');
      setAdError('Failed to load ad SDK');
      skipToContent();
    };

    document.head.appendChild(script);

    return () => {
      destroyAdsManager();
      if (adsLoaderRef.current) {
        adsLoaderRef.current.contentComplete();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeIMA = useCallback(() => {
    if (!adContainerRef.current || !adVideoRef.current || !window.google?.ima) {
      console.error('[HilltopAds] Missing required elements');
      skipToContent();
      return;
    }

    try {
      // Create ad display container
      adDisplayContainerRef.current = new window.google.ima.AdDisplayContainer(
        adContainerRef.current,
        adVideoRef.current
      );

      // Create ads loader
      adsLoaderRef.current = new window.google.ima.AdsLoader(adDisplayContainerRef.current);

      // Add event listeners
      adsLoaderRef.current.addEventListener(
        window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false
      );

      adsLoaderRef.current.addEventListener(
        window.google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false
      );

      // Create ads request
      const adsRequest = new window.google.ima.AdsRequest();
      adsRequest.adTagUrl = vastUrl!;
      adsRequest.linearAdSlotWidth = adContainerRef.current.clientWidth || 640;
      adsRequest.linearAdSlotHeight = adContainerRef.current.clientHeight || 360;

      console.log('[HilltopAds] Requesting ads from:', vastUrl);
      adsLoaderRef.current.requestAds(adsRequest);

    } catch (err) {
      console.error('[HilltopAds] Error initializing IMA:', err);
      skipToContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vastUrl, skipToContent]);

  const onAdsManagerLoaded = useCallback((adsManagerLoadedEvent: unknown) => {
    const event = adsManagerLoadedEvent as ImaAdsManagerLoadedEvent;

    try {
      // Get ads manager
      const contentPlayer = { currentTime: 0, duration: 0 };
      adsManagerRef.current = event.getAdsManager(contentPlayer);

      // Add event listeners
      const ima = window.google.ima;

      adsManagerRef.current.addEventListener(ima.AdEvent.Type.LOADED, () => {
        console.log('[HilltopAds] Ad loaded');
        setHasAd(true);
        setIsLoading(false);
      });

      adsManagerRef.current.addEventListener(ima.AdEvent.Type.STARTED, () => {
        console.log('[HilltopAds] Ad started');
        setAdPlaying(true);
      });

      adsManagerRef.current.addEventListener(ima.AdEvent.Type.COMPLETE, () => {
        console.log('[HilltopAds] Ad completed');
        skipToContent();
      });

      adsManagerRef.current.addEventListener(ima.AdEvent.Type.SKIPPED, () => {
        console.log('[HilltopAds] Ad skipped');
        handleAdSkip();
      });

      adsManagerRef.current.addEventListener(ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
        console.log('[HilltopAds] All ads completed');
        skipToContent();
      });

      adsManagerRef.current.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, onAdError);

      // Initialize AdDisplayContainer (required before starting ads)
      adDisplayContainerRef.current?.initialize();

      // Initialize and start the ads manager
      const width = adContainerRef.current?.clientWidth || 640;
      const height = adContainerRef.current?.clientHeight || 360;

      adsManagerRef.current.init(width, height, window.google.ima.ViewMode.NORMAL);
      adsManagerRef.current.start();

    } catch (err) {
      console.error('[HilltopAds] Error in ads manager:', err);
      skipToContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipToContent, handleAdSkip]);

  const onAdError = useCallback((adErrorEvent: unknown) => {
    console.log('[HilltopAds] Ad error or no ads available:', adErrorEvent);

    // Check if it's just "no ads" (empty VAST)
    const errorMessage = String(adErrorEvent);
    if (errorMessage.includes('VAST') || errorMessage.includes('empty')) {
      console.log('[HilltopAds] No ads available (empty VAST), skipping to content');
    } else {
      console.log('[HilltopAds] Ad error, skipping to content');
    }

    setAdError('No ads available');
    skipToContent();
  }, [skipToContent]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (adsManagerRef.current && adContainerRef.current) {
        const width = adContainerRef.current.clientWidth;
        const height = adContainerRef.current.clientHeight;
        adsManagerRef.current.resize(width, height, window.google.ima.ViewMode.NORMAL);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timeout - if loading takes too long, skip to content
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && !hasAd) {
        console.log('[HilltopAds] Timeout waiting for ads, skipping to content');
        skipToContent();
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading, hasAd, skipToContent]);

  // If there's an error and no ad, don't render anything (already skipped to content)
  if (adError && !hasAd) {
    return null;
  }

  return (
    <div className="hilltop-preroll-container">
      {/* Ad Container for IMA */}
      <div ref={adContainerRef} className="hilltop-ad-container">
        {/* Video element for ads */}
        <video
          ref={adVideoRef}
          className="hilltop-ad-video"
          playsInline
          muted={false}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && !adPlaying && (
        <div className="hilltop-loading">
          <div className="hilltop-spinner"></div>
        </div>
      )}

      {/* Ad Badge - Show when ad is playing */}
      {adPlaying && (
        <div className="hilltop-ad-badge">
          <span>AD</span>
        </div>
      )}

      {/* Video will play message - Show when ad is playing */}
      {adPlaying && (
        <div className="hilltop-video-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Video will play after ad</span>
        </div>
      )}
    </div>
  );
}
