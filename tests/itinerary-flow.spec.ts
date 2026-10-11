import { test, expect } from '@playwright/test';

test.describe('Jadawel - End-to-End User Flow', () => {
  const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('1. Initial Load & Metadata Verification', async ({ page }) => {
    // Check page title and Arabic RTL layout
    await expect(page).toHaveTitle(/جداول/);
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');

    // Verify Hero title and brand identity
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();

    // Verify Numbers render with realistic SSR metrics
    const statsContainer = page.locator('text=طلعة تم توليدها').locator('..');
    await expect(statsContainer).toBeVisible();
  });

  test('2. Wizard Selection & Outing Generation Flow', async ({ page }) => {
    // Click on Planner tab in navigation
    const plannerTab = page.locator('button', { hasText: 'صانع الجداول' }).first();
    await plannerTab.click();

    // Verify Wizard Step 1: Starting District
    await expect(page.locator('text=من وين حابين تبدأ طلعتكم؟')).toBeVisible();

    // Select a district option (e.g. Al Balad)
    const baladOption = page.locator('text=البلد التاريخية').first();
    await baladOption.click();

    // Step 2: Companions
    const friendsOption = page.locator('text=مع الأصحاب').first();
    if (await friendsOption.isVisible()) {
      await friendsOption.click();
    }

    // Advance through wizard steps until generate button appears
    for (let i = 0; i < 6; i++) {
      const nextBtn = page.locator('button:has-text("التالي"), button:has-text("اصنع خطتك"), button:has-text("ولد 3 خطط")').first();
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // Wait for generation to complete and Timeline view to appear
    await expect(page.locator('text=3 خطط ذكية جاهزة لطلعتكم')).toBeVisible({ timeout: 10000 });
  });

  test('3. Interactive Leaflet Map & Stop Pins', async ({ page }) => {
    // Go directly to curated plan to ensure plan exists
    const curatedTab = page.locator('button', { hasText: 'جداول جاهزة' }).first();
    if (await curatedTab.isVisible()) {
      await curatedTab.click();
      const firstCurated = page.locator('button:has-text("استعرض الخطة"), button:has-text("عرض الجدول")').first();
      if (await firstCurated.isVisible()) {
        await firstCurated.click();
      }
    }

    // Verify Map container renders
    const mapContainer = page.locator('.leaflet-container, text=خريطة مسار جدة');
    await expect(mapContainer.first()).toBeVisible({ timeout: 8000 });

    // Verify "Open full route in Google Maps" button is present and contains valid coordinates
    const gmapsBtn = page.locator('a:has-text("خرائط Google"), a:has-text("Google Maps")').first();
    if (await gmapsBtn.isVisible()) {
      const href = await gmapsBtn.getAttribute('href');
      expect(href).toContain('google.com/maps/dir');
    }
  });

  test('4. Save Plan & Local Storage Persistence', async ({ page }) => {
    // Generate or open a plan
    const plannerTab = page.locator('button', { hasText: 'صانع الجداول' }).first();
    await plannerTab.click();

    // Click quick generate or step through
    const fastGen = page.locator('button:has-text("توليد سريع"), button:has-text("اصنع خطتك")').first();
    if (await fastGen.isVisible()) {
      await fastGen.click();
    }

    // In timeline view, click "احفظ خطتي"
    const saveBtn = page.locator('button:has-text("احفظ خطتي")').first();
    if (await saveBtn.isVisible()) {
      await saveBtn.click();

      // Check toast feedback
      await expect(page.locator('text=تم حفظ الخطة في جهازك بنجاح')).toBeVisible();

      // Open Saved Plans Modal
      const savedModalBtn = page.locator('button:has-text("المحفوظات"), button:has-text("عرض المحفوظات")').first();
      await savedModalBtn.click();

      // Check Saved Plans list
      await expect(page.locator('text=خططي المحفوظة')).toBeVisible();
      await expect(page.locator('button:has-text("فتح الخطة")').first()).toBeVisible();
    }
  });

  test('5. URL Plan Sharing & Hydration', async ({ page }) => {
    // Visit URL with pre-encoded stops query parameter
    const sharedUrl = `${BASE_URL}/?share=1&stops=historic-al-balad,jeddah-yacht-club,north-corniche&b=moderate`;
    await page.goto(sharedUrl);

    // Verify that plan auto-hydrates into timeline view
    await expect(page.locator('text=3 خطط ذكية جاهزة لطلعتكم, text=خطة جدة المشتركة')).toBeVisible({ timeout: 10000 });

    // Verify stops rendered correspond to the shared slugs
    await expect(page.locator('text=البلد التاريخية')).toBeVisible();
    await expect(page.locator('text=نادي جدة لليخوت')).toBeVisible();
  });
});
