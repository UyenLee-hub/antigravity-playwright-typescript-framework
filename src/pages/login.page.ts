import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { envConfig } from '../config/env.config.js';
import { DashboardPage } from './dashboard.page.js';
import { ForgotPasswordPage } from './forgot-password.page.js';

export class LoginPage extends BasePage {
  // Locators verified via DOM inspection on Perfex CRM
  readonly companyLogoLocator = 'div.company-logo img';
  readonly pageHeadingLocator = 'h1';
  readonly emailInputLocator = '#email';
  readonly passwordInputLocator = '#password';
  readonly rememberMeCheckboxLocator = '#remember';
  readonly rememberMeLabelLocator = "label[for='remember']";
  readonly loginButtonLocator = "button[type='submit']";
  readonly forgotPasswordLinkLocator = "a[href*='forgot_password']";
  readonly errorMessageAlertLocator = 'div.alert-danger';
  readonly csrfTokenInputLocator = "input[name='csrf_token_name']";
  readonly passwordToggleLocator = '.toggle-password, .show-password, input#password + i';

  readonly companyLogo: Locator;
  readonly pageHeading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly rememberMeLabel: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessageAlert: Locator;
  readonly csrfTokenInput: Locator;
  readonly passwordToggle: Locator;

  constructor(page: Page) {
    super(page);
    this.companyLogo = this.page.locator(this.companyLogoLocator);
    this.pageHeading = this.page.locator(this.pageHeadingLocator);
    this.emailInput = this.page.locator(this.emailInputLocator);
    this.passwordInput = this.page.locator(this.passwordInputLocator);
    this.rememberMeCheckbox = this.page.locator(this.rememberMeCheckboxLocator);
    this.rememberMeLabel = this.page.locator(this.rememberMeLabelLocator);
    this.loginButton = this.page.locator(this.loginButtonLocator);
    this.forgotPasswordLink = this.page.locator(this.forgotPasswordLinkLocator);
    this.errorMessageAlert = this.page.locator(this.errorMessageAlertLocator);
    this.csrfTokenInput = this.page.locator(this.csrfTokenInputLocator);
    this.passwordToggle = this.page.locator(this.passwordToggleLocator);
  }

  /**
   * Navigate to Login page
   */
  public async open(): Promise<void> {
    await this.navigate(envConfig.baseUrl);
  }

  /**
   * Check if Login page form is displayed
   */
  public async isLoginPageDisplayed(): Promise<boolean> {
    const isEmailVis = await this.isVisible(this.emailInput, this.emailInputLocator, 'Email Input Field');
    const isLoginBtnVis = await this.isVisible(this.loginButton, this.loginButtonLocator, 'Login Button');
    return isEmailVis && isLoginBtnVis;
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
    await this.fill(this.emailInput, this.emailInputLocator, email, 'Email Input Field', false);
    return this;
  }

  /**
   * Get email input current value
   */
  public async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  /**
   * Enter password
   */
  public async enterPassword(password: string): Promise<this> {
    await this.fill(this.passwordInput, this.passwordInputLocator, password, 'Password Input Field', true);
    return this;
  }

  /**
   * Get password input type attribute
   */
  public async getPasswordInputType(): Promise<string> {
    return await this.getAttribute(this.passwordInput, this.passwordInputLocator, 'type', 'Password Input Field');
  }

  /**
   * Set Remember Me checkbox
   */
  public async setRememberMe(checked: boolean): Promise<this> {
    const currentlyChecked = await this.rememberMeCheckbox.isChecked();
    if (currentlyChecked !== checked) {
      try {
        await this.rememberMeLabel.click();
      } catch {
        await this.rememberMeCheckbox.setChecked(checked);
      }
    }
    return this;
  }

  /**
   * Check if Remember Me is checked
   */
  public async isRememberMeChecked(): Promise<boolean> {
    return await this.rememberMeCheckbox.isChecked();
  }

  /**
   * Check if Login Button is displayed
   */
  public async isLoginButtonDisplayed(): Promise<boolean> {
    return await this.isVisible(this.loginButton, this.loginButtonLocator, 'Login Button');
  }

  /**
   * Check if Forgot Password link is displayed
   */
  public async isForgotPasswordLinkDisplayed(): Promise<boolean> {
    return await this.isVisible(this.forgotPasswordLink, this.forgotPasswordLinkLocator, 'Forgot Password Link');
  }

  /**
   * Click Login button
   */
  public async clickLogin(): Promise<void> {
    await this.click(this.loginButton, this.loginButtonLocator, 'Login Submit Button');
  }

  /**
   * Login with email and password -> returns DashboardPage
   */
  public async loginAs(email: string, password: string): Promise<DashboardPage> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLogin();
    return new DashboardPage(this.page);
  }

  /**
   * Login expecting failure
   */
  public async loginExpectingFailure(email: string, password: string): Promise<this> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLogin();
    return this;
  }

  /**
   * Click Forgot Password link -> returns ForgotPasswordPage
   */
  public async clickForgotPassword(): Promise<ForgotPasswordPage> {
    await this.click(this.forgotPasswordLink, this.forgotPasswordLinkLocator, 'Forgot Password Link');
    return new ForgotPasswordPage(this.page);
  }

  /**
   * Get error message text
   */
  public async getErrorMessage(): Promise<string> {
    const count = await this.errorMessageAlert.count();
    if (count > 0) {
      return (await this.errorMessageAlert.allInnerTexts()).join(' ').trim();
    }
    return '';
  }

  /**
   * Check if error alert is displayed
   */
  public async isErrorAlertDisplayed(): Promise<boolean> {
    try {
      await this.errorMessageAlert.first().waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
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

  /**
   * Get email HTML5 validation message
   */
  public async getEmailValidationMessage(): Promise<string> {
    return await this.getValidationMessage(this.emailInput, this.emailInputLocator, 'Email Input Field');
  }

  /**
   * Check if password toggle icon is present
   */
  public async isPasswordTogglePresent(): Promise<boolean> {
    return (await this.passwordToggle.count()) > 0;
  }

  /**
   * Toggle password visibility
   */
  public async togglePasswordVisibility(): Promise<void> {
    if (await this.isPasswordTogglePresent()) {
      await this.click(this.passwordToggle.first(), this.passwordToggleLocator, 'Password Toggle Icon');
    }
  }

  /**
   * Submit login via Enter key in password field
   */
  public async submitViaEnterKey(): Promise<void> {
    await this.pressKey(this.passwordInput, this.passwordInputLocator, 'Enter', 'Password Input Field');
  }
}
