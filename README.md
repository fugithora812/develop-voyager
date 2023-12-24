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
