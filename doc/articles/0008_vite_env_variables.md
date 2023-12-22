# 【Vite】デプロイ環境ごとに参照する環境変数の値を変える

この記事では、Viteを利用したプロジェクトでdotenvを使って環境変数を管理し、`--mode`オプションを使ってデプロイ環境ごとに参照する値を変更する方法について解説します。

## dotenvとは？

dotenvは、環境変数を`.env`ファイルから読み込むことができるNode.jsのライブラリです。これにより、アプリケーションの設定値や秘密鍵などをコードから分離し、プロジェクトごとに異なる環境変数を簡単に管理できます。

### ref

- [dotenv - npm](https://www.npmjs.com/package/dotenv)
- [環境変数の代わりに .env ファイルを使用する (dotenv) - まくまくNode.jsノート](https://maku77.github.io/nodejs/env/dotenv.html)

## Viteでdotenvを利用する方法

Viteでは、デフォルトでdotenvがサポートされており、特別な設定やインストールは不要です。`.env`ファイルをプロジェクトのルートディレクトリに作成し、環境変数を定義するだけでViteが自動的に読み込んでくれます。

以下に、`.env`ファイルの例を示します。

```bash
API_KEY=123456789abcdef
API_URL=https://example.com/api
```

これらの環境変数は、Viteの設定ファイルやアプリケーションのコード内で`import.meta.env`オブジェクトを通してアクセスできます。

例えば、Viteの設定ファイル`vite.config.js`で環境変数を参照する方法は以下の通りです。

```javascript
export default {
  plugins: [
    // ...プラグインの設定
  ],
  define: {
    API_KEY: import.meta.env.API_KEY,
    API_URL: import.meta.env.API_URL,
  },
};
```

また、アプリケーションのコード内でも同様にアクセスできます。

```javascript
const apiKey = import.meta.env.API_KEY;
const apiUrl = import.meta.env.API_URL;
```

## --modeオプションで環境を切り替える方法

Viteでは、`--mode`オプションを使って、ビルドや開発サーバーの実行時に環境を切り替えることができます。`.env`ファイルに環境名を付けて、複数の環境ファイルを作成することができます。

例えば、開発環境用のファイルとして`.env.development`を、本番環境用のファイルとして`.env.production`を作成します。

開発環境用の`.env.development`:

```bash
API_KEY=123456789abcdef
API_URL=https://dev.example.com/api
```

本番環境用の`.env.production`:

```bash
API_KEY=987654321abcdef
API_URL=https://prod.example.com/api
```

これらの環境ファイルを利用して、`--mode`オプションで環境を切り替えるには、`package.json`の`scripts`に以下のように記述します。

```json
{
  "scripts": {
    "dev": "vite --mode development",
    "build:dev": "vite build --mode development",
    "build:prod": "vite preview --mode production"
  }
}
```

上記の設定により、`npm run dev`で開発環境の起動、`npm run build:dev`および`npm run build:prod`でテスト環境／本番環境デプロイのためのビルドがそれぞれ選択されます。選択された環境に応じて、Viteは適切な`.env`ファイルを読み込み、環境変数が反映されます。

## まとめ

Viteでは、dotenvがデフォルトでサポートされており、環境変数の管理が容易になります。また、`--mode`オプションを使って環境ごとに参照する値を変えることができます。これにより、開発環境と本番環境で異なる設定を簡単に切り替えることが可能となり、効率的な開発が実現できます。

- [環境変数とモード | Vite](https://ja.vitejs.dev/guide/env-and-mode.html)
- [Vite を使ってアプリケーションに環境変数を参照させる方法を考える – PSYENCE:MEDIA](https://blog.recruit.co.jp/rmp/front-end/post-21271/)
