import { defineConfig, devices } from '@playwright/test'

// 参考: https://playwright.dev/docs/test-configuration
// 開発サーバ(vite)は port 5173 で起動する（vite.config.ts と揃える）
const PORT = 5173
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests/playwright',
  // 同一ファイル内は並列、CI ではシャーディング(GitHub Actions側)と併用する
  fullyParallel: true,
  // CI で test.only を残したまま push したら落とす
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // CI ではマージ前提の blob レポートを出力する（e2e-test-base.yml でまとめる）
  reporter: process.env.CI ? 'blob' : 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  // テスト実行前に vite dev server を立ち上げる
  webServer: {
    command: 'yarn dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
