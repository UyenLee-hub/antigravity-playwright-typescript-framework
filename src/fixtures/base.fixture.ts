import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { DashboardPage } from '../pages/dashboard.page.js';
import { ForgotPasswordPage } from '../pages/forgot-password.page.js';
import { WaitHelper } from '../utils/wait.helper.js';

/**
 * Custom Fixtures Type Definition
 */
type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  forgotPasswordPage: ForgotPasswordPage;
  waitHelper: WaitHelper;
};

/**
 * Extended Playwright Test with built-in Page Objects and Failure Screenshot Auto-Capture
 */
export const test = baseTest.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  forgotPasswordPage: async ({ page }, use) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await use(forgotPasswordPage);
  },

  waitHelper: async ({}, use) => {
    const waitHelper = new WaitHelper();
    await use(waitHelper);
  },

  // Fixture hook: Automatically captures full-page screenshot on test failure
  page: async ({ page }, use, testInfo) => {
    await use(page);

    if (testInfo.status !== testInfo.expectedStatus) {
      try {
        const failureScreenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach('FAILURE_SCREENSHOT', {
          body: failureScreenshot,
          contentType: 'image/png',
        });
      } catch (err) {
        console.warn(`[Fixture] Could not take failure screenshot: ${(err as Error).message}`);
      }
    }
  },
});

export { expect };
