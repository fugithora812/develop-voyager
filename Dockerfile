FROM public.ecr.aws/docker/library/node:20.9.0-slim

# Lambda Web Adapterのインストール
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.1 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=3000


RUN echo "AWS_ROLE_ARN=${AWS_ROLE_ARN}" >> .env.local
COPY ./next.config.js ./
COPY ./public ./public
COPY ./.next/static ./.next/static
COPY ./.next/standalone ./
# COPY ./.env.local ./.env.local
RUN echo "AWS_ROLE_ARN: ${AWS_ROLE_ARN}"
RUN ls -la

# ベースイメージ変更に伴う調整
ENTRYPOINT ["node"]
CMD ["server.js"]
