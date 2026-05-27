import { test, expect } from '@playwright/test';

test('create event type and navigate to booking page', async ({ page }) => {
  await page.goto('/admin');

  await page.getByPlaceholder('Например, Встреча 1-на-1').fill('Test Meeting');
  await page.getByPlaceholder('Краткое описание').fill('A test meeting description');
  await page.getByPlaceholder('30').fill('30');

  await page.getByRole('button', { name: 'Добавить' }).click();

  await expect(page.getByRole('table')).toContainText('Test Meeting');

  await page.goto('/');

  const card = page.locator('.event-card').filter({ hasText: 'Test Meeting' });
  await expect(card).toBeVisible();

  await card.click();

  await expect(page).toHaveURL(/\/book\//);
});
