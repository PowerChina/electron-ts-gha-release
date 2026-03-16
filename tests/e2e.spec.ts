import { test, expect } from '@playwright/test';
import { _electron as electron, ElectronApplication, Page } from 'playwright';
import path from 'node:path';

let app: ElectronApplication;
let page: Page;

test.beforeAll(async () => {
  app = await electron.launch({
    args: ['.'],
    cwd: path.resolve(__dirname, '..')
  });
  page = await app.firstWindow();
});

test.afterAll(async () => {
  await app.close();
});

test('core interactions should work', async () => {
  await expect(page.locator('#grid .card')).toHaveCount(4);

  await page.click('#themeBtn');
  await expect(page.locator('body')).toHaveClass(/dark/);

  await page.selectOption('#zoneSelect', 'Asia/Tokyo');
  await page.fill('#aliasInput', '日本 · 东京');
  await page.click('#addBtn');
  await expect(page.locator('#grid .card')).toHaveCount(5);

  await page.locator('#grid .card').last().locator('button[data-edit="1"]').click();
  await expect(page.locator('#grid .card').last()).toContainText('日本 · 东京');

  await page.locator('#grid .card').last().locator('button[data-del="1"]').click();
  await expect(page.locator('#grid .card')).toHaveCount(4);

  await page.fill('#sizeInput', '36');
  await page.fill('#colorInput', '#ff4d4f');

  await page.click('#compactBtn');
  await expect(page.locator('body')).toHaveClass(/compact/);
  const rootStyle = await page.evaluate(() => {
    const style = getComputedStyle(document.body);
    return {
      size: style.getPropertyValue('--timeSize').trim(),
      color: style.getPropertyValue('--timeColor').trim()
    };
  });
  expect(rootStyle.size).toBe('36px');
  expect(rootStyle.color.toLowerCase()).toBe('#ff4d4f');
});
