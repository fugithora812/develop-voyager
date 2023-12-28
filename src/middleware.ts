import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isMaintenanceMode = false; // Boolean(process.env.NEXT_PUBLIC_MAINTENANCE_MODE);

// ログイン不要でアクセスできるページ
const publicPaths = ['/', '/login', '/maintenance'];
const publicPathPrefixes = ['/articles'];

export const middleware = async (request: NextRequest): Promise<NextResponse | undefined> => {
  console.log('[middleware] request.url:', request.url);
  if (isMaintenanceMode) {
    // 繰り返しリダイレクトを防ぐ
    if (request.nextUrl.pathname === '/maintenance') return;

    console.info('maintenance mode is ongoing...');
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // メンテナンスモードでない時は、/maintenance を404にする
  if (request.nextUrl.pathname === '/maintenance') {
    console.info('maintenance is unavailable.');
    request.nextUrl.pathname = '/404';
    return NextResponse.rewrite(request.nextUrl);
  }
  if (request.nextUrl.pathname === '/login') return;

  // ログイン不要でアクセスできるページかどうか
  const isPublicPath =
    publicPathPrefixes.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    publicPaths.some((path) => request.nextUrl.pathname === path);

  if (isPublicPath) {
    console.info(`"${request.nextUrl.pathname ?? ''}" is public path.`);
    return;
  }

  const res = await fetch(`${request.nextUrl.origin}/api/idToken`, {
    method: 'POST',
    body: JSON.stringify({ idToken: cookies().get('next-auth.session-token')?.value }),
  })
    .then((res) => {
      console.log('[middleware] res:', res.status, res.statusText);
      return res;
    })
    .catch((err) => {
      console.error(err);
      return NextResponse.redirect(new URL('/login', request.url));
    });
  if (res.status === 401) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
