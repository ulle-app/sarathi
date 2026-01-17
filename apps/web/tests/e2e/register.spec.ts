import { test, expect } from '@playwright/test';

test('register flow smoke test', async ({ page }) => {
  await page.goto('http://localhost:3000/register');
  await page.fill('input[name="firstName"]', 'Test');
  await page.fill('input[name="lastName"]', 'User');
  await page.fill('input[name="email"]', `test+${Date.now()}@example.com`);
  await page.fill('input[name="password"]', 'Str0ngP@ss!');
  await page.fill('input[name="confirmPassword"]', 'Str0ngP@ss!');
  // select academic level if present
  const hasSelect = await page.$('select[name="academicLevel"]');
  if (hasSelect) {
    await page.selectOption('select[name="academicLevel"]', 'professional');
  }
  await page.click('button:has-text("Create account")');
  // expect navigation to dashboard or a success toast
  await expect(page).toHaveURL(/dashboard/);
});
