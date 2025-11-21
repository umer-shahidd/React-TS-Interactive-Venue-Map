import { test, expect } from '@playwright/test';

test.describe('Seating Map Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('loads venue map successfully', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Metropolis Arena');
    await expect(page.locator('svg[role="application"]')).toBeVisible();
  });

  test('displays seat details on click', async ({ page }) => {
    const firstSeat = page.locator('circle[data-seat-id]').first();
    await firstSeat.click();

    await expect(page.locator('text=Seat Details')).toBeVisible();
    await expect(page.locator('text=Section')).toBeVisible();
  });

  test('selects and deselects seats', async ({ page }) => {
    const seat = page.locator('circle[data-seat-id]').first();
    await seat.click();

    await expect(page.locator('text=1 / 8')).toBeVisible();

    await seat.click();

    await expect(page.locator('text=0 / 8')).toBeVisible();
  });

  test('enforces maximum seat selection limit', async ({ page }) => {
    const seats = page.locator('circle[data-seat-id]');

    for (let i = 0; i < 10; i++) {
      await seats.nth(i).click();
    }

    await expect(page.locator('text=8 / 8')).toBeVisible();
  });

  test('displays total price for selected seats', async ({ page }) => {
    const seat = page.locator('circle[data-seat-id]').first();
    await seat.click();

    await expect(page.locator('text=Total')).toBeVisible();
    await expect(page.locator('text=/\\$\\d+\\.\\d{2}/')).toBeVisible();
  });

  test('removes individual seats from selection', async ({ page }) => {
    const seats = page.locator('circle[data-seat-id]');
    await seats.nth(0).click();
    await seats.nth(1).click();

    await expect(page.locator('text=2 / 8')).toBeVisible();

    const removeButton = page.locator('button[aria-label*="Remove"]').first();
    await removeButton.click();

    await expect(page.locator('text=1 / 8')).toBeVisible();
  });

  test('clears all selections', async ({ page }) => {
    const seats = page.locator('circle[data-seat-id]');
    await seats.nth(0).click();
    await seats.nth(1).click();

    await expect(page.locator('text=2 / 8')).toBeVisible();

    const clearButton = page.locator('button:has-text("Clear Selection")');
    await clearButton.click();

    await expect(page.locator('text=No seats selected yet')).toBeVisible();
  });

  test('persists selection after page reload', async ({ page }) => {
    const seat = page.locator('circle[data-seat-id]').first();
    await seat.click();

    await expect(page.locator('text=1 / 8')).toBeVisible();

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=1 / 8')).toBeVisible();
  });

  test('zoom controls work correctly', async ({ page }) => {
    const zoomInButton = page.locator('button[aria-label="Zoom in"]');
    const zoomOutButton = page.locator('button[aria-label="Zoom out"]');

    await expect(page.locator('text=100%')).toBeVisible();

    await zoomInButton.click();
    await expect(page.locator('text=120%')).toBeVisible();

    await zoomOutButton.click();
    await expect(page.locator('text=100%')).toBeVisible();
  });

  test('legend is visible', async ({ page }) => {
    await expect(page.locator('text=Legend')).toBeVisible();
    await expect(page.locator('text=Available')).toBeVisible();
    await expect(page.locator('text=Selected')).toBeVisible();
    await expect(page.locator('text=Reserved')).toBeVisible();
    await expect(page.locator('text=Sold')).toBeVisible();
  });
});

test.describe('Mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('displays correctly on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText('Metropolis Arena');
    await expect(page.locator('svg[role="application"]')).toBeVisible();
  });

  test('seat selection works on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const seat = page.locator('circle[data-seat-id]').first();
    await seat.tap();

    await expect(page.locator('text=1 / 8')).toBeVisible();
  });
});
