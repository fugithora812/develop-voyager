This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### VSCode利用の場合

.vscode/extensions.jsonで指定してある拡張機能のインストールをオススメします。

src/app/globals.cssにCSS周りでのwarningが出る場合がありますが、Tailwind CSS IntelliSenseの拡張機能をインストールの上でsettings.jsonに以下の設定を追記することで解消できます。

```json
  "files.associations": {
    "*.css": "tailwindcss"
  }
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy

同階層に`fugithora812/personal-aws-infra`がcloneされている時、以下のコマンドでデプロイできます。

```bash
aws sso login
make login

# build Next.js Docker image
make build

# deploy to ECR and update Lambda with Terraform
make deploy
```

## サポートするMarkdown独自記法

### コードブロック

以下のように書くことでファイル名、差分ハイライトをサポートします。

```
```ts:vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
+ import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
- plugins: [react()],
+ plugins: [react(), tsconfigPaths()],
});
```
```

![code_image](https://private-user-images.githubusercontent.com/63992141/292649423-5f063ea0-6683-47c6-9508-69080954ad7c.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE3MDMzODMxOTYsIm5iZiI6MTcwMzM4Mjg5NiwicGF0aCI6Ii82Mzk5MjE0MS8yOTI2NDk0MjMtNWYwNjNlYTAtNjY4My00N2M2LTk1MDgtNjkwODA5NTRhZDdjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJV05KWUFYNENTVkVINTNBJTJGMjAyMzEyMjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjMxMjI0VDAxNTQ1NlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWQzNTQ0Mzc5OTE3YzkyZGYzOThmMDUyMTc0NWNkZGM4NDhlNjQzMmMxOGQzODQ0OWY1ZWUzNTM4MTk5YWMyYzMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.bIjxqac89HLEUiKHT3BmSQhMQTC37qVZ4CQCKrh4Mdg)

### 引用ブロック

引用の最後を改行し「from: 」プレフィックスをつけて出典元を記載することで引用の出典表示をサポートします。

```
> オブジェクト指向は「現実世界の物事に即したデータモデル」である一方で、関係データベースは「検索やCRUDなどの処理に最適化されたデータモデル」となっている。
from: [オブジェクト関係マッピング](https://qiita.com/yk-nakamura/items/acd071f16cda844579b9)
```

![quote_image](https://private-user-images.githubusercontent.com/63992141/292651619-6afa6981-dc9c-425c-b80a-76cf3b1eca5e.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE3MDMzODM2NDEsIm5iZiI6MTcwMzM4MzM0MSwicGF0aCI6Ii82Mzk5MjE0MS8yOTI2NTE2MTktNmFmYTY5ODEtZGM5Yy00MjVjLWI4MGEtNzZjZjNiMWVjYTVlLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJV05KWUFYNENTVkVINTNBJTJGMjAyMzEyMjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjMxMjI0VDAyMDIyMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWExYjhhY2Q2Nzg3YmFmNjkxNDI5N2Q5M2U2NzEwZjgyYWVhMDZmNzI3OWMwMTRiZTY1YzRjNzcxMGI0N2ZhMzgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.ljpFI0Fvt3oK6YAgTqWNCWiwAKWr9FYyPh8llboeVds)

