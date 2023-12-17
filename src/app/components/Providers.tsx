'use client';
import { FC, PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  );
};
