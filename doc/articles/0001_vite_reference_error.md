# "Uncaught ReferenceError: global is not defined"に対応する

React×Viteで開発中に出たエラーの対応をまとめる。

## エラー内容

React×Viteで開発していて、aws-sdkライブラリを入れたら`Uncaught ReferenceError: global is not defined`というエラーが出て画面が正常にレンダリングされなくなった。

![](https://storage.googleapis.com/zenn-user-upload/ece962cd285f-20230326.png)

## 対応策

> このエラーは、JavaScriptのグローバルオブジェクトにアクセスしようとしたが、定義されていないといった時に発生します。
> JavaScriptのグローバルオブジェクトは、ブラウザ上とNode.js上では異なり、ブラウザ上では”window”、Node.js上では”global”がそれにあたります。

=> [【React × Vite】Uncaught ReferenceError: global is not defined | Almonta Blog](https://almonta2021blog.com/react-vite-global-error/)

vite.config.tsにglobal ⇆ window間の互換を定義することで解決。

```ts:vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
+  define: {
+    global: 'window',
+  }
})

```
