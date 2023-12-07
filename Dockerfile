# Multi-stage buildでNext.jsをビルド
FROM --platform=linux/arm64 node:20 AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# ベースイメージの変更
FROM --platform=linux/arm64 public.ecr.aws/docker/library/node:20.9.0-slim

# Lambda Web Adapterのインストール
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.1 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=3000

COPY --from=builder /build/next.config.js ./
COPY --from=builder /build/public ./public
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/.next/standalone ./

# ベースイメージ変更に伴う調整
ENTRYPOINT ["node"]
CMD ["server.js"]
