# 開発用 Dockerfile
FROM node:26-slim

WORKDIR /app

# NOTE: node:26 イメージには yarn / corepack が同梱されていないため、npm で yarn(classic) を入れる
RUN npm install -g yarn

# 依存だけ先にコピーしてキャッシュを効かせる
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ソースをコピー（実際の開発では compose のボリュームマウントで上書きされる）
COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]
