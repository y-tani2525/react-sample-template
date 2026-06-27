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
| E2E テスト | [Playwright](https://playwright.dev/) | 1.61 |
| 実行環境 | [Docker](https://www.docker.com/) / Docker Compose | - |
| ベースイメージ | `node:26-slim` | - |

## 前提条件

- [Docker](https://www.docker.com/) / Docker Compose が利用可能であること
  （Docker Desktop など）

ホスト側に Node.js や yarn は不要です。

## ディレクトリ構成

```
.
├── docker-compose.yml          # コンテナ起動・ボリュームマウント設定
├── README.md
├── .github/
│   └── workflows/
│       ├── e2e-test-base.yml   # 再利用ワークフロー（セットアップ・シャーディング・レポート統合）
│       └── e2e-test.yml        # PR トリガーの呼び出し側ワークフロー
└── frontend/
    ├── Dockerfile              # node:26-slim ベースの開発用イメージ
    ├── .dockerignore
    ├── package.json            # 依存定義
    ├── yarn.lock               # ロックファイル
    ├── vite.config.ts          # host:true + usePolling（Docker 用 HMR 設定）
    ├── playwright.config.ts    # Playwright（E2E）設定
    ├── tsconfig*.json
    ├── index.html
    ├── tests/
    │   └── playwright/
    │       └── _template.spec.ts # E2E テストのテンプレート（コピーして使う）
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

## E2E テスト（Playwright）

E2E テストは [Playwright](https://playwright.dev/) で記述し、`frontend/tests/playwright/` 配下に置きます。
テスト実行前に Playwright が自動で開発サーバ（`yarn dev` / port 5173）を起動します（`playwright.config.ts` の `webServer`）。

### ローカルでの実行

```bash
# 初回のみ: ブラウザのバイナリを取得（chromium / firefox / webkit）
docker compose exec frontend yarn playwright install --with-deps

# 全テストを実行
docker compose exec frontend yarn test:e2e

# 特定ファイル / ブラウザだけ実行
docker compose exec frontend yarn test:e2e tests/playwright/_template.spec.ts --project=chromium
```

> `_template.spec.ts` がテンプレートです。新しいテストはこれをコピーして作成してください。

### CI（GitHub Actions）

PR 作成時に `frontend/**` などへの変更があると、`.github/workflows/e2e-test.yml` が
再利用ワークフロー `e2e-test-base.yml` を呼び出して E2E を実行します。

- **シャーディング**: テストを 2 分割（matrix）して並列実行し、所要時間を短縮します
- **キャッシュ**: `node_modules` と Playwright のブラウザバイナリをキャッシュします
- **レポート統合**: 各シャードの blob レポートを 1 つの HTML レポートにまとめ、アーティファクトとして保存します

別の spec を CI 対象に追加したい場合は、`e2e-test.yml` でジョブを追加し、`target_file` に
（`tests/playwright/` からの相対）パスを渡します。

```yaml
jobs:
  template:
    uses: ./.github/workflows/e2e-test-base.yml
    with:
      target_file: "_template.spec.ts"
```

## Docker 特有の設定ポイント

- **`server.host: true`**（vite.config.ts）
  コンテナ内の `0.0.0.0` で待ち受け、ホストからアクセス可能にする
- **`server.watch.usePolling: true` / `CHOKIDAR_USEPOLLING=true`**
  ボリュームマウント越しでも HMR（ホットリロード）が効くようにする
- **`node_modules` を匿名ボリューム化**（docker-compose.yml）
  ホスト側で上書きされず、コンテナ内の依存を使用する
