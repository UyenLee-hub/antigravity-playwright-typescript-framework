import { Page, Locator, test } from '@playwright/test';
import { Logger } from '../utils/logger.js';
import { WaitHelper } from '../utils/wait.helper.js';
import { envConfig } from '../config/env.config.js';

export abstract class BasePage {
  public readonly page: Page;
  protected readonly waitHelper: WaitHelper;

  constructor(page: Page) {
    this.page = page;
    this.waitHelper = new WaitHelper();
  }

  /**
   * Navigate to target path or full URL with DOMContentLoaded wait
   */
  public async navigate(targetUrl: string = ''): Promise<void> {
    const url = targetUrl || '/';
    await test.step(`Navigate to URL: "${url}" and wait for DOMContentLoaded`, async () => {
      Logger.info(`Navigating to URL: ${url}`);
      await this.page.goto(url);
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  /**
   * Click element with explicit locator value and parameter in step name
   */
  public async click(locator: Locator, locatorSelector: string, elementName: string): Promise<void> {
    await test.step(`Click on ${elementName} [Locator: "${locatorSelector}"]`, async () => {
      Logger.step('Click', `${elementName} [${locatorSelector}]`);
      await this.waitHelper.waitForElementVisible(locator);
      await this.waitHelper.waitForElementEnabled(locator);
      await locator.click();
    });
  }

  /**
   * Fill input element with explicit locator value and parameter in step name
   */
  public async fill(
    locator: Locator,
    locatorSelector: string,
    value: string,
    elementName: string,
    isMasked: boolean = false
  ): Promise<void> {
    const isSensitive =
      isMasked ||
      locatorSelector.toLowerCase().includes('password') ||
      elementName.toLowerCase().includes('password') ||
      (!!value &&
        !!envConfig.credentials.adminEmail &&
        value.trim().toLowerCase() === envConfig.credentials.adminEmail.trim().toLowerCase()) ||
      (!!value && !!envConfig.credentials.adminPassword && value === envConfig.credentials.adminPassword);

    const displayValue = isSensitive ? '••••••••' : `"${value}"`;
    await test.step(`Fill ${elementName} [Locator: "${locatorSelector}"] with value: ${displayValue}`, async () => {
      Logger.step('Fill', `${elementName} [${locatorSelector}] -> ${displayValue}`);
      await this.waitHelper.waitForElementVisible(locator);
      await locator.fill(value);
    });
  }

  /**
   * Send keys / press key on element
   */
  public async pressKey(locator: Locator, locatorSelector: string, key: string, elementName: string): Promise<void> {
    await test.step(`Press key '${key}' on ${elementName} [Locator: "${locatorSelector}"]`, async () => {
      Logger.step('PressKey', `${elementName} [${locatorSelector}] -> ${key}`);
      await this.waitHelper.waitForElementVisible(locator);
      await locator.press(key);
    });
  }

  /**
   * Get text content from element with explicit locator metadata
   */
  public async getText(locator: Locator, locatorSelector: string, elementName: string): Promise<string> {
    return await test.step(`Retrieve inner text from ${elementName} [Locator: "${locatorSelector}"]`, async () => {
      await this.waitHelper.waitForElementVisible(locator);
      const text = (await locator.innerText()).trim();
      Logger.debug(`Retrieved text from ${elementName}: "${text}"`);
      return text;
    });
  }

  /**
   * Get element attribute
   */
  public async getAttribute(
    locator: Locator,
    locatorSelector: string,
    attributeName: string,
    elementName: string
  ): Promise<string> {
    return await test.step(`Get attribute '${attributeName}' of ${elementName} [Locator: "${locatorSelector}"]`, async () => {
      await this.waitHelper.waitForElementVisible(locator);
      const attr = (await locator.getAttribute(attributeName)) || '';
      return attr.trim();
    });
  }

  /**
   * Get HTML5 validation message from an input element
   */
  public async getValidationMessage(locator: Locator, locatorSelector: string, elementName: string): Promise<string> {
    return await test.step(`Get HTML5 validation message from ${elementName} [Locator: "${locatorSelector}"]`, async () => {
      await this.waitHelper.waitForElementVisible(locator);
      return await locator.evaluate((node: HTMLInputElement) => node.validationMessage || '');
    });
  }

  /**
   * Check element visibility with locator metadata
   */
  public async isVisible(locator: Locator, locatorSelector: string, elementName: string): Promise<boolean> {
    return await test.step(`Check visibility of ${elementName} [Locator: "${locatorSelector}"]`, async () => {
      return await locator.isVisible();
    });
  }

  /**
   * Check if checkbox is checked
   */
  public async isChecked(locator: Locator, locatorSelector: string, elementName: string): Promise<boolean> {
    return await test.step(`Check if ${elementName} is checked [Locator: "${locatorSelector}"]`, async () => {
      await this.waitHelper.waitForElementVisible(locator);
      return await locator.isChecked();
    });
  }

  /**
   * Set checkbox checked state
   */
  public async setCheckbox(
    locator: Locator,
    locatorSelector: string,
    checked: boolean,
    elementName: string
  ): Promise<void> {
    await test.step(`Set checkbox ${elementName} [Locator: "${locatorSelector}"] to ${checked}`, async () => {
      await this.waitHelper.waitForElementVisible(locator);
      await locator.setChecked(checked);
    });
  }

  /**
   * Attach screenshot evidence into current test step safely
   */
  public async attachStepScreenshot(stepEvidenceName: string = 'Step_Screenshot_Evidence'): Promise<void> {
    await test.step(`Capture screenshot evidence: "${stepEvidenceName}"`, async () => {
      try {
        const screenshot = await this.page.screenshot({ timeout: 5000 });
        await test.info().attach(stepEvidenceName, {
          body: screenshot,
          contentType: 'image/png',
        });
      } catch (err) {
        Logger.warn(`Failed to capture step screenshot: ${(err as Error).message}`);
      }
    });
  }

  /**
   * Get current browser URL
   */
  public getURL(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  public async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
