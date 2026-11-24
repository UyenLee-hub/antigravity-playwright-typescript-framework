import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

/**
 * Page Object for Perfex CRM Forgot Password page:
 * https://crm.anhtester.com/admin/authentication/forgot_password
 */
export class ForgotPasswordPage extends BasePage {
  readonly companyLogoLocator = 'div.company-logo img';
  readonly pageHeadingLocator = 'h1';
  readonly emailInputLocator = '#email';
  readonly confirmButtonLocator = "button[type='submit']";
  readonly alertBannerLocator = 'div.alert';
  readonly csrfTokenInputLocator = "input[name='csrf_token_name']";

  readonly companyLogo: Locator;
  readonly pageHeading: Locator;
  readonly emailInput: Locator;
  readonly confirmButton: Locator;
  readonly alertBanner: Locator;
  readonly csrfTokenInput: Locator;

  constructor(page: Page) {
    super(page);
    this.companyLogo = this.page.locator(this.companyLogoLocator);
    this.pageHeading = this.page.locator(this.pageHeadingLocator);
    this.emailInput = this.page.locator(this.emailInputLocator);
    this.confirmButton = this.page.locator(this.confirmButtonLocator);
    this.alertBanner = this.page.locator(this.alertBannerLocator);
    this.csrfTokenInput = this.page.locator(this.csrfTokenInputLocator);
  }

  /**
   * Check if Forgot Password page is displayed
   */
  public async isForgotPasswordPageDisplayed(): Promise<boolean> {
    const isEmailVis = await this.isVisible(this.emailInput, this.emailInputLocator, 'Email Input Field');
    const isConfirmVis = await this.isVisible(this.confirmButton, this.confirmButtonLocator, 'Confirm Button');
    return isEmailVis && isConfirmVis;
  }

  /**
   * Check if Company Logo is displayed
   */
  public async isLogoDisplayed(): Promise<boolean> {
    return await this.isVisible(this.companyLogo, this.companyLogoLocator, 'Company Logo');
  }

  /**
   * Get Page Heading Text
   */
  public async getPageHeading(): Promise<string> {
    return await this.getText(this.pageHeading, this.pageHeadingLocator, 'Page Heading');
  }

  /**
   * Enter email
   */
  public async enterEmail(email: string): Promise<this> {
    await this.fill(this.emailInput, this.emailInputLocator, email, 'Forgot Password Email Input Field', false);
    return this;
  }

  /**
   * Click Confirm button
   */
  public async clickConfirm(): Promise<void> {
    await this.click(this.confirmButton, this.confirmButtonLocator, 'Confirm Submit Button');
  }

  /**
   * Submit email for password recovery
   */
  public async submitForgotPassword(email: string): Promise<this> {
    await this.enterEmail(email);
    await this.clickConfirm();
    return this;
  }

  /**
   * Get alert message text
   */
  public async getAlertMessage(): Promise<string> {
    const count = await this.alertBanner.count();
    if (count > 0) {
      return (await this.alertBanner.allInnerTexts()).join(' ').trim();
    }
    return '';
  }

  /**
   * Check if alert message is displayed
   */
  public async isAlertDisplayed(): Promise<boolean> {
    try {
      await this.alertBanner.first().waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get email HTML5 validation message
   */
  public async getEmailValidationMessage(): Promise<string> {
    return await this.getValidationMessage(this.emailInput, this.emailInputLocator, 'Email Input Field');
  }

  /**
   * Get CSRF token value
   */
  public async getCsrfTokenValue(): Promise<string> {
    return (await this.csrfTokenInput.first().getAttribute('value')) || '';
  }

  /**
   * Check if CSRF token element exists
   */
  public async isCsrfTokenPresent(): Promise<boolean> {
    return (await this.csrfTokenInput.count()) > 0;
  }
}
