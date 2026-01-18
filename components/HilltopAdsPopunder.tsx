'use client';

import { useEffect, useRef } from 'react';

export default function HilltopAdsPopunder() {
    const popunderTriggeredRef = useRef(false);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        // Load HilltopAds popunder script
        const loadScript = () => {
            if (scriptLoadedRef.current) return;

            const script = document.createElement('script');
            (script as any).settings = {};
            script.src = process.env.NEXT_PUBLIC_HILLTOPADS_POPUNDER ||
                '//humiliating-jump.com/ckD/9j6.bo2/5wlvS/WvQj9RNfjMcS1pMBDAcc5/M/i/0q2/NrzwUkw_NGztkzzG';
            script.async = true;
            script.referrerPolicy = 'no-referrer-when-downgrade';

            script.onload = () => {
                console.log('✅ HilltopAds Popunder script loaded');
                scriptLoadedRef.current = true;
            };

            script.onerror = (e) => {
                console.error('❌ Failed to load HilltopAds script:', e);
            };

            // Insert script at the end of body
            document.body.appendChild(script);
        };

        // Load script on mount
        loadScript();

        const handleClick = (e: MouseEvent | TouchEvent) => {
            // Pastikan ini adalah interaksi user yang genuine
            if (!e.isTrusted) return;

            // Log popunder trigger pada klik pertama
            if (!popunderTriggeredRef.current) {
                popunderTriggeredRef.current = true;
                console.log('🎯 HilltopAds Popunder triggered (managed by HilltopAds script)');
            }
        };

        // Event listener
        document.addEventListener('click', handleClick as EventListener);
        document.addEventListener('touchend', handleClick as EventListener);

        return () => {
            document.removeEventListener('click', handleClick as EventListener);
            document.removeEventListener('touchend', handleClick as EventListener);
        };
    }, []);

    // No visual element needed, just script injection
    return null;
}
