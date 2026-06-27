import { test, expect } from '@playwright/test'

// テンプレート用のサンプル E2E テスト。
// 新しい spec を作るときはこのファイルをコピーして使う。
// e2e-test-base.yml には target_file として例えば "_template.spec.ts" を渡す。

test.describe('カウンター', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('タイトルが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('+1 / -1 / reset でカウントが変化する', async ({ page }) => {
    const count = page.locator('.count')
    await expect(count).toHaveText('0')

    await page.getByRole('button', { name: '+1' }).click()
    await page.getByRole('button', { name: '+1' }).click()
    await expect(count).toHaveText('2')

    await page.getByRole('button', { name: '-1' }).click()
    await expect(count).toHaveText('1')

    await page.getByRole('button', { name: 'reset' }).click()
    await expect(count).toHaveText('0')
  })
})
