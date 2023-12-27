# 【JS × Firebase】"Auth/network-request-failed"が地味ハマリポイントだった

## これは何？

Next.js(App Router)のアプリケーションで、Firebaseを使ったログイン機能をつけようとして出たエラー`Auth/network-request-failed`への対応ログです。

Next.jsでFirebaseを利用する手法については直接扱わないのですが、以下の記事がとても参考になりましたので、紹介しておきます😚

- [【Next.js】NextAuth×Firebaseで認証管理 in appディレクトリ](https://zenn.dev/tentel/articles/cc76611f4010c9)

## エラー出現

以下のような実装でログインフォームを作って、Firebaseで認証をしようとしたある日のこと。

```ts
'use client';
import React from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@/firebase/client';

const LoginForm = (): React.ReactElement => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async (): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // ログインができたかどうかを簡単に示す
        alert('ログインOK!');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
      <>
        <form>
          <input
            type="text"
            id="sign-in-email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Your email"
          />
          <input
            type="password"
            id="sign-in-email"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Your password"
          />
          <button
            onClick={handleLogin}
            type="submit"
          >
            Login
          </button>
        </form>
      </>
  );
};

export default LoginForm;
```

ログインできるはずのemail & passwordを入力してLoginボタンを押すと、firebaseと通信するためのAPI_KEYの設定が正しいはずなのに"network-request-failed"に。

![error](https://github.com/fugithora812/nextjs-tutorial/blob/809cbda60ed40789a9e24a18be678f97b0eb83c0/doc/articles/images/0010_01.png?raw=true)

## 真実はシンプルだった

色々調べた結果、↑は「"素のformタグ"を使っていたから」ということがわかりました。

というのもこの実装では、formタグで囲ったLoginボタンを押すとページの更新が走ってしまうために、せっかくbuttonの`onClick`で処理しようとしていたfirebaseでの認証処理が中断されてエラーが発生していたのです。

ということで、私は囲っているformタグを削除してエラー解消に成功しました。

![login_ok](https://github.com/fugithora812/nextjs-tutorial/blob/809cbda60ed40789a9e24a18be678f97b0eb83c0/doc/articles/images/0010_02.png?raw=true)

ちなみにこのエラーは「認証の処理中にページの更新が走った」ことが本質的な原因ですが、handleLoginをformタグの`onSubmit`で呼び出すことでは回避できませんでした。多分非同期処理を書いた関数をawaitつけずに呼んでるからだとおもう。

## 参考

- [Firebase Project Results in "Auth/network-request-failed" error on login - Stack Overflow](https://stackoverflow.com/questions/38860900/firebase-project-results-in-auth-network-request-failed-error-on-login)
