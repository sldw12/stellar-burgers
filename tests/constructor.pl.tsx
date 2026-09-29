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

    // Проверяем реальные данные ингредиента
    await expect(modal).toContainText('4242'); // калории
    await expect(modal).toContainText('420');  // белки
    await expect(modal).toContainText('142');  // жиры
    await expect(modal).toContainText('242');  // углеводы

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

    // Проверяем очистку начинки
    await expect(
      page.getByTestId('constructor-ingredients')
    ).not.toContainText(
      'Биокотлета из марсианской Магнолии'
    );

    // Проверяем очистку булки
    await expect(
      page.getByTestId('constructor-ingredients')
    ).not.toContainText(
      'Краторная булка N-200i'
    );
  });
});