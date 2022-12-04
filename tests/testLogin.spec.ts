import {test, expect} from "@playwright/test"

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:8090/login');
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('qwer');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('qwer');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Create New Melody' }).click();
  await page.getByRole('button', { name: 'Phrase Structure' }).click();
  await page.locator('[id="a"]').click();
  await page.getByRole('button', { name: 'a\'' }).click();
  await page.locator('[id="b"]').click();
  await page.getByRole('button', { name: 'Half Cadence' }).click();
  await page.locator('[id="c"]').click();
  await page.getByRole('button', { name: 'c\'' }).click();
  await page.locator('[id="d"]').click();
  await page.getByRole('button', { name: 'Authentic Cadence' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('link', { name: 'qwer\'s Melodies' }).click();
  await page.getByRole('cell', { name: 'a a\' b [AC]' }).click();
  await page.getByRole('button', { name: 'Phrase Structure' }).click();
  await page.getByText('a a\' b [AC]').click();
});