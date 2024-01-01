import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { auth } from '@/firebase/admin';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {},
      secret: process.env.NEXT_AUTH_SECRET,
      // @ts-expect-error eslint-disable-line
      authorize: async ({ idToken }: any, _req) => {
        if (typeof idToken === 'string') {
          try {
            const decoded = await auth.verifyIdToken(idToken);
            return { ...decoded };
          } catch (err) {
            console.error(err);
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // @ts-expect-error eslint-disable-line
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    // @ts-expect-error eslint-disable-line
    async session({ session, token }) {
      console.log('============== api/v1/auth/[slug]/route.ts ==============');
      console.log('session:', JSON.stringify(session));
      console.log('token:', JSON.stringify(token));

      if (typeof session.user === 'undefined') {
        console.error('session.user is undefined.');
        return;
      }
      session.user.emailVerified = token.emailVerified;
      session.user.uid = token.uid;
      console.log('=========== ============ ============');
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
