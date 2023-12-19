import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from './components/Providers';

import './globals.css';

import { SEO_DEFAULT } from './seo_config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = SEO_DEFAULT;

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
