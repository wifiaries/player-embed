'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function AdsterraPopunder() {
  const clickCountRef = useRef(0);
  const directLinkUrl = process.env.NEXT_PUBLIC_DIRECTLINK_ADSTERRA || 
    'https://stoopeddiscourse.com/jinq93yxp?key=89a71a1e87218de7ed3f406db888198c';
  
  const scriptUrl = process.env.NEXT_PUBLIC_POPUNDER_ADSTERRA || 
    '//stoopeddiscourse.com/10/ff/96/10ff965e2697a4ee6c71e8f58ddb0b0d.js';

  useEffect(() => {
    const handleClick = () => {
      clickCountRef.current += 1;
      
      console.log(`Click count: ${clickCountRef.current}`);
      
      // Buka directlink setelah klik ke-2
      if (clickCountRef.current === 3) {
        window.open(directLinkUrl, '_blank', 'noopener,noreferrer');
        console.log('DirectLink opened!');
        
        // Reset counter setelah membuka link
        clickCountRef.current = 0;
      }
    };

    // Listen untuk click dan touch events
    document.addEventListener('click', handleClick);
    document.addEventListener('touchend', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchend', handleClick);
    };
  }, [directLinkUrl]);

  return (
    <Script
      src={scriptUrl}
      strategy="afterInteractive"
      onLoad={() => {
        console.log('Adsterra popunder loaded successfully');
      }}
      onError={(e) => {
        console.error('Failed to load Adsterra script:', e);
      }}
    />
  );
}