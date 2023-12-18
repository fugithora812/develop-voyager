import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from './components/Providers';

import './globals.css';

// eslint-disable-next-line
import Favicon from '/public/favicon.ico';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TweetTech',
  description: 'TweetTech is a blog about technology, programming, and more.',
  icons: [{ rel: 'icon', url: Favicon.src }],
};

const RootLayout = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
