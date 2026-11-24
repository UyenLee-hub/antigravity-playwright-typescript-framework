import { Locator, Page, expect } from '@playwright/test';
import { envConfig } from '../config/env.config.js';
import { Logger } from './logger.js';

export class WaitHelper {
  private readonly defaultTimeout: number;

  constructor(defaultTimeout: number = envConfig.timeouts.explicitWait) {
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Smart wait for element to be visible using Playwright web-first assertion
   */
  public async waitForElementVisible(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    Logger.debug(`Waiting for element to be visible: ${locator.toString()}`);
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Smart wait for element to be hidden/detached
   */
  public async waitForElementHidden(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    Logger.debug(`Waiting for element to be hidden: ${locator.toString()}`);
    await expect(locator).toBeHidden({ timeout });
  }

  /**
   * Smart wait for element to be enabled
   */
  public async waitForElementEnabled(locator: Locator, timeout: number = this.defaultTimeout): Promise<void> {
    Logger.debug(`Waiting for element to be enabled: ${locator.toString()}`);
    await expect(locator).toBeEnabled({ timeout });
  }

  /**
   * Smart wait for URL matching regex pattern
   */
  public async waitForURL(page: Page, urlPattern: RegExp | string, timeout: number = this.defaultTimeout): Promise<void> {
    Logger.debug(`Waiting for URL matching: ${urlPattern.toString()}`);
    await expect(page).toHaveURL(urlPattern, { timeout });
  }
}
