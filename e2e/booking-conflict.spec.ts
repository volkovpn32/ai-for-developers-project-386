import { test, expect } from '@playwright/test';

test('duplicate booking shows conflict error', async ({ page }) => {
  await page.goto('/admin');

  await page.getByPlaceholder('Например, Встреча 1-на-1').fill('30-min chat');
  await page.getByPlaceholder('Краткое описание').fill('A 30 minute chat');
  await page.getByPlaceholder('30').fill('30');

  await page.getByRole('button', { name: 'Добавить' }).click();
  await expect(page.getByRole('table')).toContainText('30-min chat');

  await page.goto('/');
  const card = page.locator('.event-card').filter({ hasText: '30-min chat' });
  await card.click();
  await expect(page).toHaveURL(/\/book\//);

  await page.locator('mat-datepicker-toggle button').click();
  await page.locator('.mat-calendar-body-today').click();

  await page.locator('.slot-btn').first().waitFor();
  await page.locator('.slot-btn').first().click();

  await page.getByPlaceholder('Иван Иванов').fill('Test User');
  await page.getByPlaceholder('ivan@example.com').fill('test@example.com');
  await page.getByRole('button', { name: 'Подтвердить бронирование' }).click();

  await expect(page.locator('.slot-btn').first()).toBeVisible();

  await page.locator('.slot-btn').first().click();

  await page.getByPlaceholder('Иван Иванов').fill('Another User');
  await page.getByPlaceholder('ivan@example.com').fill('another@example.com');
  await page.getByRole('button', { name: 'Подтвердить бронирование' }).click();

  await expect(page.locator('.error-banner')).toContainText('Ошибка создания бронирования');
});
