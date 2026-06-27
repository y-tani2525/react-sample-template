# 開発用 Dockerfile
FROM node:22-slim

WORKDIR /app

# 依存だけ先にコピーしてキャッシュを効かせる
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ソースをコピー（実際の開発では compose のボリュームマウントで上書きされる）
COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]
