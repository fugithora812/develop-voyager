'use client';
import React from 'react';
import { type FC, type PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';

import SessionProvider from '@/app/components/SessionProvider';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
};
