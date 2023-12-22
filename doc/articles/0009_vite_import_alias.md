# 【Vite×React】import時のパスエイリアスを設定してみる

プライベートで開発中のVite × Reactアプリケーション。それなりの規模になってきて、そろそろ相対パスでimportするのが辛くなってきた。。

```js
import { PicturesApi } from '../../../api';
import { useApiRequest } from '../../../hooks/useApiRequest';

...
```

そこで今回は、パスエイリアスを設定してこの辛みから逃れてみます。

大まかには以下の２通りがありそう。

## 1. vite.config.tsのresolve.alias記述とtsconfig.json設定の組み合わせ

vite.config.tsに`resolve.alias`を記述し、それとtsconfig.jsonでのパスエイリアス設定を組み合わせて設定する方法です。

```ts:vite.config.ts
export default defineConfig({
resolve: {
  alias: [
    { find: '@picture-app/', replacement: `${__dirname}/src/` },
  ],
},
  plugins: [react()],
});
```

```json:tsconfig.json
{
  "compilerOptions": {
  "baseUrl": "./",
  "paths": {
    "@picture-app/*": ["src/*"],
  },
    ...
```

この手法での主な注意点は、

- vite.config.tsのaliasに定義するreplacementは末尾の`/`までちゃんと書く
- tsconfig.jsonは末尾の`/*`をしっかり書く

こと。

## 2. vite-tsconfig-pathsとtsconfig.json設定の組み合わせ

２つ目は`vite-tsconfig-paths`を利用した設定方法です。まずは該当パッケージをインストール。

```bash
npm i -D vite-tsconfig-paths
```

```ts:vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
plugins: [react(), tsconfigPaths()],
});
```

```json:tsconfig.json
{
  "compilerOptions": {
   "baseUrl": "./",
   "paths": {
     "@picture-app/*": ["src/*"],
   },
    ...
```

こちらの手法だと、パスエイリアスに関する設定記述はtsconfig.jsonの側に一元化することができるので、時間が経つごとにありがたみが増しそう。ということで今回はこちらの手法を選択しました。

# おまけ: VSCode でパスエイリアスの補完が効くように

[Path Autocomplete](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete)の拡張機能を入れつつ、以下のように設定を追加することで補完も効かせられます。

```json:.vscode/settings.json
{
  "path-autocomplete.pathMappings": {
    "@picture-app": "${folder}/src",
  }
...
}
```

ちなみにこちらは末尾の`/`を気にしなくてもOK。

https://chaika.hatenablog.com/entry/2022/05/14/083000

https://github.com/KiKiKi-KiKi/ts-react-app#gear-vscode-settings-for-auto-completion-of-path-aliases
