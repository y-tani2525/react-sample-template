# React Sample Template

Docker 上で動く React + Vite + Zustand + TypeScript の開発環境テンプレートです。
ホストに Node.js / yarn をインストールせず、すべてコンテナ内で完結します。

## 技術スタック

| 種類 | 技術 | バージョン |
| --- | --- | --- |
| ライブラリ | [React](https://react.dev/) | 19 |
| ビルドツール | [Vite](https://vite.dev/) | 6 |
| 状態管理 | [Zustand](https://zustand.docs.pmnd.rs/) | 5 |
| 言語 | [TypeScript](https://www.typescriptlang.org/) | 5.7 |
| パッケージマネージャ | [Yarn](https://classic.yarnpkg.com/) (Classic) | 1.22 |
| 実行環境 | [Docker](https://www.docker.com/) / Docker Compose | - |
| ベースイメージ | `node:22-slim` | - |

## 前提条件

- [Docker](https://www.docker.com/) / Docker Compose が利用可能であること
  （Docker Desktop など）

ホスト側に Node.js や yarn は不要です。

## ディレクトリ構成

```
.
├── docker-compose.yml          # コンテナ起動・ボリュームマウント設定
├── README.md
└── frontend/
    ├── Dockerfile              # node:22-slim ベースの開発用イメージ
    ├── .dockerignore
    ├── package.json            # 依存定義
    ├── yarn.lock               # ロックファイル
    ├── vite.config.ts          # host:true + usePolling（Docker 用 HMR 設定）
    ├── tsconfig*.json
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx             # Zustand を使ったカウンター UI
        ├── store/
        │   └── counterStore.ts # Zustand ストアのサンプル
        ├── index.css
        └── App.css
```

## 環境構築（git clone 後）

```bash
# 1. リポジトリを取得
git clone <repository-url>
cd react_sample_template

# 2. イメージをビルドしてコンテナを起動
docker compose up -d --build
```

起動後、ブラウザで http://localhost:5173 を開くと
Zustand で状態管理されたカウンターが表示されます。

`src/` 配下を編集すると、HMR（ホットリロード）で即座にブラウザへ反映されます。

## よく使うコマンド

```bash
docker compose up -d          # 起動（バックグラウンド）
docker compose up -d --build  # 依存変更後などに再ビルドして起動
docker compose logs -f        # ログを表示
docker compose restart        # 再起動
docker compose down           # 停止・削除
```

## パッケージの追加・削除

コンテナ内で `yarn` を実行します。`./frontend` がボリュームマウントされているため、
`package.json` と `yarn.lock` の更新はホスト側にも即反映されます。

```bash
# 通常の依存を追加
docker compose exec frontend yarn add axios

# 開発依存を追加
docker compose exec frontend yarn add -D vitest

# 削除
docker compose exec frontend yarn remove axios
```

> 依存を変更した後、反映が怪しい場合は `docker compose restart frontend` で再起動してください。
> CI などで `yarn.lock` を確実にイメージへ焼き込みたい場合は `docker compose up -d --build` で再ビルドします。

## ビルド（本番用バンドルの生成）

```bash
docker compose exec frontend yarn build      # dist/ に出力
docker compose exec frontend yarn preview    # ビルド結果をプレビュー
```

## Docker 特有の設定ポイント

- **`server.host: true`**（vite.config.ts）
  コンテナ内の `0.0.0.0` で待ち受け、ホストからアクセス可能にする
- **`server.watch.usePolling: true` / `CHOKIDAR_USEPOLLING=true`**
  ボリュームマウント越しでも HMR（ホットリロード）が効くようにする
- **`node_modules` を匿名ボリューム化**（docker-compose.yml）
  ホスト側で上書きされず、コンテナ内の依存を使用する
