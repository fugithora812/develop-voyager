# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 重要なガイドライン
**ALWAYS Response by Japanese** - 必ず日本語で回答してください。

## よく使用されるコマンド

### 開発
```bash
npm run dev        # 開発サーバー起動 (http://localhost:3000)
npm run build      # プロダクションビルド
npm run start      # プロダクションサーバー起動
npm run lint       # Next.js linting
```

### コード品質チェック・修正
```bash
npm run check:prettier    # Prettierフォーマットチェック
npm run fix:prettier      # Prettierフォーマット自動修正
npm run check:eslint      # ESLintチェック
npm run fix:eslint        # ESLint自動修正
```

### Docker・デプロイ
```bash
# AWS ECRログイン
make login

# ビルド（npm run build + Dockerイメージ作成）
make build

# AWSデプロイ
make deploy
```

## アーキテクチャ概要

### Next.js App Router構成
- `/src/app/` - App Routerベースのページ・レイアウト
- `/src/app/api/` - API Routes (NextAuth認証、その他API)
- `/src/app/components/` - 共通プロバイダー (Providers.tsx, SessionProvider.tsx)
- `/src/app/atoms/` - 再利用可能なUIコンポーネント
- `/src/app/lib/` - ユーティリティ関数・クライアント

### 認証システム
- NextAuth.js + Firebase Admin SDK
- `/src/firebase/` - Firebase設定 (client.ts, admin.ts)
- `/src/middleware.ts` - 認証ミドルウェア

### データ層
- AWS DynamoDB (記事メタデータ)
- Markdownファイル (`/doc/articles/`) - 記事コンテンツ
- `/doc/articleMetadata/metadata.json` - 記事メタデータ

### スタイリング・UI
- Tailwind CSS + DaisyUI
- next-themes (ダークモード対応)
- TypeScript strict設定

### デプロイメント
- Next.js standalone output (Lambda対応)
- Docker + AWS ECR + Lambda
- Terraformによるインフラ管理 (personal-aws-infra リポジトリ)

### パスエイリアス
- `@/*` → `./src/*` (tsconfig.json設定済み)

### 記事システム
- Markdownベースの記事管理
- 記事スラッグベースのルーティング (`/articles/[slug]`)
- remark + react-markdown でレンダリング
- シンタックスハイライト対応

## 開発時の注意点
- CSS warningが出る場合は Tailwind CSS IntelliSense 拡張機能をインストールし、settings.jsonに `"*.css": "tailwindcss"` を追加
- 厳密なESLint設定（max-warnings=0）
- standaloneビルド設定のためDocker環境での動作確認推奨