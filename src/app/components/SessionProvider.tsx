'use client';
import React from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export interface SessionProviderProps {
  children: React.ReactNode;
}

const SessionProvider = ({ children }: SessionProviderProps): React.ReactElement => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
};

export default SessionProvider;
