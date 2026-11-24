import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './src/config/env.config.js';

/**
 * Playwright E2E Automation Framework Configuration
 * Strictly typed, Desktop 1920x1080 viewport, Allure reporting with filtered steps
 */
export default defineConfig({
  testDir: './src/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: envConfig.retries,
  workers: envConfig.workers,
  timeout: envConfig.timeouts.default,
  expect: {
    timeout: envConfig.timeouts.expect,
  },
  globalSetup: require.resolve('./src/config/global.setup.ts'),
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        outputFolder: 'allure-results',
        detail: false,
        suiteTitle: true,
      },
    ],
  ],
  use: {
    baseURL: envConfig.baseUrl,
    headless: envConfig.headless,
    viewport: envConfig.viewport,
    actionTimeout: envConfig.timeouts.explicitWait,
    navigationTimeout: envConfig.timeouts.default,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: envConfig.viewport,
      },
    },
  ],
});
