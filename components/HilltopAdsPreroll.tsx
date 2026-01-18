'use client';

import React, { useEffect, useState, useCallback } from 'react';
import './HilltopAdsPreroll.css';

interface HilltopAdsPrerollProps {
  onAdComplete: () => void;
  onAdSkipped?: () => void;
}

export default function HilltopAdsPreroll({ onAdComplete, onAdSkipped }: HilltopAdsPrerollProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [adError, setAdError] = useState(false);

  const adUrl = process.env.NEXT_PUBLIC_HILLTOPADS_VSAT;

  const handleSkip = useCallback(() => {
    if (canSkip) {
      onAdSkipped?.();
      onAdComplete();
    }
  }, [canSkip, onAdComplete, onAdSkipped]);

  const handleAdClick = useCallback(() => {
    if (adUrl) {
      window.open(adUrl, '_blank', 'noopener,noreferrer');
    }
  }, [adUrl]);

  useEffect(() => {
    // Set loading to false after ad container is ready
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-complete after 15 seconds if user doesn't skip
    const autoCompleteTimer = setTimeout(() => {
      onAdComplete();
    }, 15000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(autoCompleteTimer);
    };
  }, [isLoading, onAdComplete]);

  // Handle ad load error
  useEffect(() => {
    if (!adUrl) {
      setAdError(true);
      // If no ad URL, skip directly to video
      setTimeout(() => {
        onAdComplete();
      }, 500);
    }
  }, [adUrl, onAdComplete]);

  if (adError) {
    return null;
  }

  return (
    <div className="hilltop-preroll-container">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="hilltop-loading">
          <div className="hilltop-spinner"></div>
          <p>Loading advertisement...</p>
        </div>
      )}

      {/* Ad Content */}
      {!isLoading && (
        <>
          {/* Ad Banner Area - Clickable */}
          <div className="hilltop-ad-content" onClick={handleAdClick}>
            <div className="hilltop-ad-banner">
              <div className="hilltop-ad-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                  <line x1="7" y1="2" x2="7" y2="22"></line>
                  <line x1="17" y1="2" x2="17" y2="22"></line>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <line x1="2" y1="7" x2="7" y2="7"></line>
                  <line x1="2" y1="17" x2="7" y2="17"></line>
                  <line x1="17" y1="17" x2="22" y2="17"></line>
                  <line x1="17" y1="7" x2="22" y2="7"></line>
                </svg>
              </div>
              <div className="hilltop-ad-text">
                <span className="hilltop-ad-label">Advertisement</span>
                <span className="hilltop-ad-cta">Click to learn more</span>
              </div>
              <div className="hilltop-glow-effect"></div>
            </div>
          </div>

          {/* Ad Badge */}
          <div className="hilltop-ad-badge">
            <span>AD</span>
          </div>

          {/* Skip Button / Countdown */}
          <div className="hilltop-skip-container">
            {canSkip ? (
              <button className="hilltop-skip-button" onClick={handleSkip}>
                <span>Skip Ad</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                  <line x1="19" y1="5" x2="19" y2="19"></line>
                </svg>
              </button>
            ) : (
              <div className="hilltop-countdown">
                <span>Skip in {countdown}s</span>
                <div className="hilltop-countdown-progress">
                  <div 
                    className="hilltop-countdown-bar" 
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Video will play message */}
          <div className="hilltop-video-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Video will play after ad</span>
          </div>
        </>
      )}
    </div>
  );
}
