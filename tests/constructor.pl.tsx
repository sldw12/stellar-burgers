import { test, expect } from '@playwright/test';

test.describe('constructor works correctly', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/mock-api.har', {
      url: '**/api/**',
      update: false,
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token';
    });

    await page.goto('/');
  });

  test('should add ingredient to constructor', async ({ page }) => {
    const ingredientCard = page.getByTestId('ingredient-main-1');

    await ingredientCard.getByText('Добавить').click();

    await expect(
      page.getByTestId('constructor-ingredients')
    ).toContainText('Биокотлета из марсианской Магнолии');
  });

  test('should open and close ingredient modal', async ({ page }) => {
    await page.getByTestId('ingredient-main-1').click();

    const modal = page.getByTestId('ingredient-modal');

    await expect(modal).toBeVisible();

    await expect(modal).toContainText(
      'Биокотлета из марсианской Магнолии'
    );

    await expect(modal).toContainText('Калории');
    await expect(modal).toContainText('Белки');
    await expect(modal).toContainText('Жиры');
    await expect(modal).toContainText('Углеводы');

    await page.getByLabel('Закрыть').click();

    await expect(modal).not.toBeVisible();
  });

  test('should create order successfully and clear constructor', async ({
    page,
  }) => {
    await page
      .getByTestId('ingredient-bun-1')
      .getByText('Добавить')
      .click();

    await page
      .getByTestId('ingredient-main-1')
      .getByText('Добавить')
      .click();

    await page.getByText('Оформить заказ').click();

    await expect(
      page.getByTestId('order-number')
    ).toHaveText('424242');

    await expect(
      page.getByTestId('constructor-ingredients')
    ).not.toContainText(
      'Биокотлета из марсианской Магнолии'
    );
  });
});