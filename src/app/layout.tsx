import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

// @ts-ignore
import Favicon from '/public/favicon.ico';
import './globals.css';
import { Providers } from './components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TweetTech',
  description: 'TweetTech is a blog about technology, programming, and more.',
  icons: [{ rel: 'icon', url: Favicon.src }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
