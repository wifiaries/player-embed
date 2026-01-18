'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import HilltopAdsPreroll from './HilltopAdsPreroll';

// Dynamic import to avoid SSR issues and ensure proper DOM mounting
const ModernVideoPlayer = dynamic(() => import('./ModernVideoPlayer'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    ),
});

interface VideoPlayerWithAdsProps {
    src: string;
    poster?: string;
    autoplay?: boolean;
}

export default function VideoPlayerWithAds({ src, poster, autoplay = false }: VideoPlayerWithAdsProps) {
    const [adComplete, setAdComplete] = useState(false);

    const handleAdComplete = useCallback(() => {
        setAdComplete(true);
    }, []);

    const handleAdSkipped = useCallback(() => {
        console.log('Ad was skipped');
    }, []);

    return (
        <div className="relative w-full h-full bg-black">
            {/* Pre-roll Ad - Show first */}
            {!adComplete && (
                <HilltopAdsPreroll
                    onAdComplete={handleAdComplete}
                    onAdSkipped={handleAdSkipped}
                />
            )}

            {/* Video Player - Only render after ad is complete */}
            {adComplete && (
                <div className="w-full h-full">
                    <ModernVideoPlayer
                        src={src}
                        poster={poster}
                        autoplay={true}
                    />
                </div>
            )}
        </div>
    );
}
