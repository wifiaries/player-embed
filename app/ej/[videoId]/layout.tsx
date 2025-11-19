import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
  title: 'StreamVid Player',
};

export default function StreamVidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {children}
    </div>
  );
}