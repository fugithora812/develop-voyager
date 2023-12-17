// @ts-ignore
import Favicon from '/public/favicon.ico';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TweetTech',
  description: 'TweetTech is a blog about technology, programming, and more.',
  icons: [{ rel: 'icon', url: Favicon.src }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <Suspense fallback={<span className="loading loading-dots loading-lg" />}>
        <body className={inter.className}>{children}</body>
      </Suspense>
    </html>
  );
}
