import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { LoginPage } from './login.page.js';

export class DashboardPage extends BasePage {
  // Locators verified on Perfex CRM Dashboard
  readonly userProfileDropdownLocator = 'li.header-user-profile a.dropdown-toggle';
  readonly desktopLogoutMenuItemLocator = 'li.header-user-profile li.header-logout a, a[href*="logout"]';
  readonly dashboardWrapperLocator = 'div#wrapper, li.menu-item-dashboard';

  readonly userProfileDropdown: Locator;
  readonly desktopLogoutMenuItem: Locator;
  readonly dashboardWrapper: Locator;

  constructor(page: Page) {
    super(page);
    this.userProfileDropdown = this.page.locator(this.userProfileDropdownLocator);
    this.desktopLogoutMenuItem = this.page.locator(this.desktopLogoutMenuItemLocator);
    this.dashboardWrapper = this.page.locator(this.dashboardWrapperLocator).first();
  }

  /**
   * Check if dashboard is loaded and displayed
   */
  public async isDashboardDisplayed(): Promise<boolean> {
    try {
      await this.page.waitForURL((url) => url.pathname.includes('/admin') && !url.pathname.includes('/authentication'), {
        timeout: 10000,
      });
      await this.dashboardWrapper.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if User Profile dropdown is displayed
   */
  public async isUserProfileDisplayed(): Promise<boolean> {
    return await this.isVisible(this.userProfileDropdown, this.userProfileDropdownLocator, 'User Profile Dropdown');
  }

  /**
   * Perform Logout from Dashboard
   */
  public async logout(): Promise<LoginPage> {
    try {
      await this.click(this.userProfileDropdown, this.userProfileDropdownLocator, 'User Profile Dropdown');
      await this.click(this.desktopLogoutMenuItem.first(), this.desktopLogoutMenuItemLocator, 'Logout Menu Item');
    } catch {
      await this.page.evaluate(() => {
        // @ts-ignore
        if (typeof logout === 'function') {
          // @ts-ignore
          logout();
        } else {
          window.location.href = '/admin/authentication/logout';
        }
      });
    }
    await this.page.waitForURL((url) => url.pathname.includes('/authentication'), { timeout: 10000 });
    return new LoginPage(this.page);
  }
}
