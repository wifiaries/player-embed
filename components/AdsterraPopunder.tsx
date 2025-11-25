'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function AdsterraPopunder() {
  const clickCountRef = useRef(0);
  const lastDirectLinkRef = useRef(0);
  const popunderTriggeredRef = useRef(false);
  
  const directLinkUrl = process.env.NEXT_PUBLIC_DIRECTLINK_ADSTERRA || 
    'https://stoopeddiscourse.com/jinq93yxp?key=89a71a1e87218de7ed3f406db888198c';
  
  const scriptUrl = process.env.NEXT_PUBLIC_POPUNDER_ADSTERRA || 
    '//stoopeddiscourse.com/10/ff/96/10ff965e2697a4ee6c71e8f58ddb0b0d.js';

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      // Pastikan ini adalah interaksi user yang genuine
      if (!e.isTrusted) return;

      // Hitung klik untuk directlink
      clickCountRef.current += 1;
      console.log(`Click count: ${clickCountRef.current}`);

      // Log popunder trigger pada klik pertama
      if (!popunderTriggeredRef.current) {
        popunderTriggeredRef.current = true;
        console.log('🎯 Popunder triggered (managed by Adsterra script)');
      }
      
      // DirectLink pada klik ke-2
      if (clickCountRef.current === 5) {
        const now = Date.now();
        const timeSinceLastClick = now - lastDirectLinkRef.current;
        
        // Cooldown 60 detik
        if (timeSinceLastClick < 60000 && lastDirectLinkRef.current !== 0) {
          console.log('⏳ DirectLink cooldown active, waiting...');
          clickCountRef.current = 1; // Keep at 1, don't reset to 0
          return;
        }
        
        // Buka directlink di tab baru
        const newWindow = window.open(directLinkUrl, '_blank', 'noopener,noreferrer');
        
        if (newWindow) {
          console.log('✅ DirectLink opened in new tab!');
          lastDirectLinkRef.current = now;
          clickCountRef.current = 0; // Reset setelah berhasil
        } else {
          console.warn('⚠️ Popup blocked! Please allow popups for this site.');
          clickCountRef.current = 1; // Keep at 1 to try again
        }
      }
    };

    // Event listener dengan passive: false agar tidak mengganggu Adsterra script
    document.addEventListener('click', handleClick as EventListener);
    document.addEventListener('touchend', handleClick as EventListener);

    return () => {
      document.removeEventListener('click', handleClick as EventListener);
      document.removeEventListener('touchend', handleClick as EventListener);
    };
  }, [directLinkUrl]);

  return (
    <>
      {/* Adsterra Popunder Script - Ini akan handle popunder otomatis */}
      <Script
        type="text/javascript"
        src={scriptUrl}
        strategy="lazyOnload"
        onLoad={() => {
          console.log('✅ Adsterra Popunder script loaded');
          console.log('ℹ️  Popunder will trigger on first user click/interaction');
        }}
        onError={(e) => {
          console.error('❌ Failed to load Adsterra script:', e);
        }}
      />
    </>
  );
}