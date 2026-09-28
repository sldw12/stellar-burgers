import { test, expect } from '@playwright/test';

test.describe('constructor works correctly', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/mock-api.har', {
      url: '**/api/**',
      update: false,
    });

    await page.goto('/');
  });

  test('should add ingredient to constructor', async ({ page }) => {
    const ingredientCard = page
      .getByText('Биокотлета из марсианской Магнолии')
      .locator('..')
      .locator('..');

    await ingredientCard.getByText('Добавить').click();

    await expect(
      page.getByTestId('constructor-ingredients')
    ).toContainText('Биокотлета из марсианской Магнолии');
  });

  test('should open and close ingredient modal', async ({ page }) => {
    await page
      .getByText('Биокотлета из марсианской Магнолии')
      .click();

    await expect(
      page.getByText('Детали ингредиента')
    ).toBeVisible();

    await page.getByLabel('Закрыть').click();

    await expect(
      page.getByText('Детали ингредиента')
    ).not.toBeVisible();
  });

  test('should create order successfully', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token';
    });

    await page.reload();

    const bun = page.getByText('Краторная булка N-200i');

    await bun
      .locator('..')
      .locator('..')
      .getByText('Добавить')
      .click();

    const ingredient = page.getByText('Биокотлета из марсианской Магнолии');

    await ingredient
      .locator('..')
      .locator('..')
      .getByText('Добавить')
      .click();

    await page.getByText('Оформить заказ').click();

    await expect(
      page.getByTestId('order-number')
    ).toHaveText('424242');
  });
});