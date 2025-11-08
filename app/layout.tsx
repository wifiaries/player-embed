import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Video Embed Player',
  description: 'Embeddable video player',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}