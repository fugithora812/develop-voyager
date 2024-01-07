# 【Next.js】Firebaseによる認証機構を実装してみる with App router

ここではNext.js(App router)のアプリケーションに、Firebaseを使って認証機構を実装してみます。

## 記事の前提

この記事では、以下の状況を前提として実装を進めます。

- Next.js v14.0.3 × Tailwind CSSで構築したアプリケーション
- App routerを利用して実装を進めている
- 認証はFirebaseを利用する

また、既に類似記事([【Next.js】NextAuth×Firebaseで認証管理 in appディレクトリ](https://zenn.dev/tentel/articles/cc76611f4010c9))がzennに存在しますがこちらとは別記事・別著者です。本記事は↑の記事を読み込んだ筆者が自らのアプリケーションに適用するにあたって遭遇したエラーを乗り越え、最終的に辿り着いた実装を紹介するものです。

## 全体像

先に、実装全体のイメージをシーケンス図でお見せします。

![firebase_auth_sequence](https://storage.googleapis.com/zenn-user-upload/b99f3b80b1ff-20240107.png)

### ↑の図の補足説明

- LoginFormはclient componentです
- TopPageはログイン必須を想定したcomponentです
(client or serverは任意)
- `/api...`は`app/api/`配下に定義するAPIです

## 必要ライブラリの準備

以下コマンドで、必要になるライブラリを導入します。

```bash
npm i next-auth firebase firebase-admin
```

## middlewareの実装

まずはmiddlewareを実装します。

```tsx:src/middleware.ts
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = async (request: NextRequest): Promise<NextResponse | undefined> => {
  console.log('[middleware] request.nextUrl:', JSON.stringify(request.nextUrl));

  // Cookieに含まれるセッショントークンの検証
  // (ログイン済みであれば200 OKが返る)
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
    // セッショントークンが検証できなければログインページへリダイレクト
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
};

export const config = {
  // 上記middlewareの処理を通さないパス
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
```

↑の実装で呼び出している`/api/idToken`のAPIは後ほど実装するので、この時点では正常なレスポンスは得られません。

## LoginFormの実装

次にLoginForm(client component)を実装します。

```tsx:src/app/login/page.tsx
'use client';
import React from 'react';
import { type NextPage } from 'next';

import LoginForm from '@/app/atoms/LoginForm';

const Login: NextPage = () => {
  return (
    <div className="flex justify-center items-center h-[85vh]">
      <LoginForm />
    </div>
  );
};

export default Login;
```

```tsx:src/app/atoms/LoginForm.tsx
'use client';
import React from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { signIn as signInByNextAuth } from 'next-auth/react';

import { auth } from '@/firebase/client';

const LoginForm = (): React.ReactElement => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // next/navigationのredirectがうまく動かないので、routerで対処
  // ref: https://stackoverflow.com/questions/76191324/next-13-4-error-next-redirect-in-api-routes
  const router = useRouter();

  const handleLogin = async (): Promise<void> => {
    const user = await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        return null;
      });
    if (user === null) return;
    const idToken = await user.getIdToken();

    await signInByNextAuth('credentials', {
      idToken,
      // 引数でログイン成功後のリダイレクト先のパス(callbackUrl)を指定しても良いが
      // 開発上の都合でメソッドチェーンでリダイレクトする形に。
      // ref: https://next-auth.js.org/getting-started/client#specifying-a-callbackurl
    }).then((res) => {
      console.log('signInByNextAuth res:', JSON.stringify(res));
      if (typeof res === 'undefined') return;
      if (res.status === 200) {
        router.push('/admin/dashboard');
      }
    });
  };

  return (
    <div className="flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
      <div className="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
        Login To Your Account
      </div>
      <div className="mt-8">
        <div className="flex flex-col mb-2">
          <div className="flex relative ">
            <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
              <svg
                width="15"
                height="15"
                fill="currentColor"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path>
              </svg>
            </span>
            <input
              type="text"
              id="sign-in-email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin(); // eslint-disable-line
                }
              }}
              placeholder="Your email"
              className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col mb-6">
          <div className="flex relative ">
            <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
              <svg
                width="15"
                height="15"
                fill="currentColor"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
              </svg>
            </span>
            <input
              type="password"
              id="sign-in-email"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin(); // eslint-disable-line
                }
              }}
              placeholder="Your password"
              className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center mb-6 -mt-4">
          <div className="flex ml-auto">
            <a
              href="#"
              className="inline-flex text-xs font-thin text-gray-500 sm:text-sm dark:text-gray-100 hover:text-gray-700 dark:hover:text-white"
            >
              Forgot Your Password?
            </a>
          </div>
        </div>
        <div className="flex w-full">
          <button
            onClick={handleLogin} // eslint-disable-line
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLogin(); // eslint-disable-line
              }
            }}
            className="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
          >
            Login
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center mt-6">
        <a
          href="#"
          target="_blank"
          className="inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white"
        >
          <span className="ml-2">You don&#x27;t have an account?</span>
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
```

これでログイン画面っぽいものができました。

![login_form_ui](https://storage.googleapis.com/zenn-user-upload/49dd4fd75fe7-20240107.png)

### ちなみに

LoginFormでimportしている@/firebase/clientは以下のような実装をしています。

```ts:src/firebase/client.ts
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// eslint-disable-next-line
const app = getApps()?.length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

NEXT_PUBLIC_API_KEY等に設定すべき値は「[\[React + Firebase Authentication\]（前編）reactプロジェクトの作成とfirebaseの初期設定](https://tech-lab.sios.jp/archives/31047#Firebase_SDK)」など、詳しく書かれた記事があるのでそちらをご覧ください🙏

## APIの実装

では、サーバサイドで稼働するAPIを準備していきます。

### セッショントークン検証API(/api/idToken)

```ts:src/app/api/idToken/route.ts
import { getAuth } from 'firebase-admin/auth';
import { type NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  idToken?: string;
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  console.info('=========== POST /api/idToken ============');

  const reqBody: RequestBody = await request.json();
  if (typeof reqBody.idToken !== 'string') {
    console.error('idToken is invalid:', reqBody.idToken);
    console.info('=========== ============ ============');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await getAuth()
    .verifyIdToken(reqBody.idToken, true)
    .catch((error) => {
      console.error('idToken is invalid.');
      console.error(error);
      console.info('=========== ============ ============');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    });
  console.info('idToken is valid.');
  console.info('=========== ============ ============');
  return NextResponse.json({ status: 'ok' });
};
```

↑では厚めにログ出ししていますが、不要であれば削除してください。

### ログイン処理API(/api/auth/[...nextauth])

```ts:src/app/api/auth/[...nextauth]/route.ts
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
```

なお、ここでimportしている@/firebase/adminは以下のような実装となっています。

```ts:src/firebase/admin.ts
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import serviceAccount from '../../firebaseSecretKey.json';
export const firebaseAdmin =
  getApps()[0] ??
  initializeApp({
    // @ts-expect-error eslint-disable-line
    credential: cert(serviceAccount),
  });

export const auth = getAuth();
```

また↑を正常に稼働させるために、「[秘密鍵の生成](https://zenn.dev/tentel/articles/cc76611f4010c9#%E7%A7%98%E5%AF%86%E9%8D%B5%E3%81%AE%E7%94%9F%E6%88%90)」を実施してトップ階層にfirebaseSecretKey.jsonを配置します。ここではその作業詳細は省きます。

## TopPageの実装

ログイン後にアクセスする想定のトップページを作成します。以下ではパスを`/admin/dashboard`とし、サンプル的なモック実装を行っています。

```tsx:src/app/admin/dashboard/page.tsx
import React from 'react';
import { type NextPage } from 'next';

const AdminDashboardPage: NextPage = () => {
  return (
    <>
      <main className="relative h-screen overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <div className="flex items-start justify-between">
          <div className="relative hidden h-screen my-4 ml-4 shadow-lg lg:block w-80">
            <div className="h-full bg-white rounded-2xl dark:bg-gray-700">
              <div className="flex items-center justify-center pt-6">
                <svg width="35" height="30" viewBox="0 0 256 366" version="1.1" preserveAspectRatio="xMidYMid">
                  <defs>
                    <linearGradient
                      x1="12.5189534%"
                      y1="85.2128611%"
                      x2="88.2282959%"
                      y2="10.0225497%"
                      id="linearGradient-1"
                    >
                      <stop stopColor="#FF0057" stopOpacity="0.16" offset="0%"></stop>
                      <stop stopColor="#FF0057" offset="86.1354%"></stop>
                    </linearGradient>
                  </defs>
                  <g>
                    <path
                      d="M0,60.8538006 C0,27.245261 27.245304,0 60.8542121,0 L117.027019,0 L255.996549,0 L255.996549,86.5999776 C255.996549,103.404155 242.374096,117.027222 225.569919,117.027222 L145.80812,117.027222 C130.003299,117.277829 117.242615,130.060011 117.027019,145.872817 L117.027019,335.28252 C117.027019,352.087312 103.404567,365.709764 86.5997749,365.709764 L0,365.709764 L0,117.027222 L0,60.8538006 Z"
                      fill="#001B38"
                    ></path>
                    <circle
                      fill="url(#linearGradient-1)"
                      transform="translate(147.013244, 147.014675) rotate(90.000000) translate(-147.013244, -147.014675) "
                      cx="147.013244"
                      cy="147.014675"
                      r="78.9933938"
                    ></circle>
                    <circle
                      fill="url(#linearGradient-1)"
                      opacity="0.5"
                      transform="translate(147.013244, 147.014675) rotate(90.000000) translate(-147.013244, -147.014675) "
                      cx="147.013244"
                      cy="147.014675"
                      r="78.9933938"
                    ></circle>
                  </g>
                </svg>
              </div>
              <nav className="mt-6">
                <div>
                  <a
                    className="flex items-center justify-start w-full p-4 my-2 font-thin text-blue-500 uppercase transition-colors duration-200 border-r-4 border-blue-500 bg-gradient-to-r from-white to-blue-100 dark:from-gray-700 dark:to-gray-800"
                    href="#"
                  >
                    <span className="text-left">
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 2048 1792"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M1070 1178l306-564h-654l-306 564h654zm722-282q0 182-71 348t-191 286-286 191-348 71-348-71-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z"></path>
                      </svg>
                    </span>
                    <span className="mx-4 text-sm font-normal">Dashboard</span>
                  </a>
                </div>
              </nav>
            </div>
          </div>
          <div className="flex flex-col w-full pl-0 md:p-4 md:space-y-4">
            <header className="z-40 items-center w-full h-16 bg-white shadow-lg dark:bg-gray-700 rounded-2xl">
              <div className="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center">
                <div className="relative flex items-center w-full pl-1 lg:max-w-68 sm:pr-2 sm:ml-0">
                  <div className="container relative left-0 z-50 flex w-3/4 h-full">
                    <div className="relative flex items-center w-full h-full lg:w-64 group">
                      <div className="absolute z-50 flex items-center justify-center w-auto h-10 p-3 pr-2 text-sm text-gray-500 uppercase cursor-pointer sm:hidden">
                        <svg
                          fill="none"
                          className="relative w-5 h-5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <svg
                        className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                      </svg>
                      <input
                        type="text"
                        className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input"
                        placeholder="Search"
                      />
                      <div className="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-2xl md:block">
                        +
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboardPage;
```

これで実装完了です。

## 参考

- [【Next.js】NextAuth×Firebaseで認証管理 in appディレクトリ](https://zenn.dev/tentel/articles/cc76611f4010c9)
- [Client API | NextAuth.js](https://next-auth.js.org/getting-started/client)
