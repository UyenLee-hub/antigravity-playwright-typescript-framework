import { test, expect } from '../../fixtures/base.fixture.js';
import { envConfig } from '../../config/env.config.js';
import * as allure from 'allure-js-commons';

test.describe('Session & Security Non-Functional Test Suite', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test("LOGIN_TC_020: Remember Me - Đăng nhập có tick 'Remember me' duy trì cookie", async ({ loginPage, context }) => {
    await allure.epic('Authentication');
    await allure.feature('Session & Security Non-Functional');
    await allure.story('Remember Me Functionality');
    await allure.severity('normal');

    await loginPage.enterEmail(envConfig.credentials.adminEmail);
    await loginPage.enterPassword(envConfig.credentials.adminPassword);
    await loginPage.setRememberMe(true);
    await loginPage.clickLogin();

    const { DashboardPage } = await import('../../pages/dashboard.page.js');
    const dashboardPage = new DashboardPage(loginPage.page);
    expect(await dashboardPage.isDashboardDisplayed(), 'Dashboard should be displayed.').toBe(true);

    const cookies = await context.cookies();
    const hasRememberOrSessionCookie = cookies.some(
      (c) =>
        c.name.toLowerCase().includes('remember') ||
        c.name.toLowerCase().includes('sp_session') ||
        c.name.toLowerCase().includes('ci_session')
    );
    expect(hasRememberOrSessionCookie, 'Session/Remember cookie must be present in the browser.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_020_Final_Evidence');
  });

  test("LOGIN_TC_021: Remember Me - Đăng nhập KHÔNG tick 'Remember me'", async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Session & Security Non-Functional');
    await allure.story('Remember Me Functionality');
    await allure.severity('normal');

    await loginPage.enterEmail(envConfig.credentials.adminEmail);
    await loginPage.enterPassword(envConfig.credentials.adminPassword);
    await loginPage.setRememberMe(false);
    await loginPage.clickLogin();

    const { DashboardPage } = await import('../../pages/dashboard.page.js');
    const dashboardPage = new DashboardPage(loginPage.page);
    expect(await dashboardPage.isDashboardDisplayed(), 'Dashboard should be displayed.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_021_Final_Evidence');
  });

  test('LOGIN_TC_023: Browser History Protection - Sau khi Logout, nhấn Back không được truy cập Dashboard', async ({
    loginPage,
    page,
  }) => {
    await allure.epic('Authentication');
    await allure.feature('Session & Security Non-Functional');
    await allure.story('Browser History Protection');
    await allure.severity('critical');

    const dashboardPage = await loginPage.loginAs(envConfig.credentials.adminEmail, envConfig.credentials.adminPassword);
    expect(await dashboardPage.isDashboardDisplayed(), 'Dashboard should be displayed.').toBe(true);

    const loggedOutPage = await dashboardPage.logout();
    expect(await loggedOutPage.isLoginPageDisplayed(), 'Logged out to login page.').toBe(true);

    // Attempt browser Back button
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');

    // User must not be on authenticated dashboard
    const currentUrl = page.url();
    const onAuthPage = currentUrl.includes('/authentication');
    const isLoginVisible = await loggedOutPage.isLoginPageDisplayed();
    expect(
      onAuthPage || isLoginVisible,
      'After logout, pressing Back must not allow unauthorized Dashboard access.'
    ).toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_023_Final_Evidence');
  });

  test('LOGIN_TC_029: Security CSRF - Kiểm tra form POST có chứa hidden token csrf_token_name', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Session & Security Non-Functional');
    await allure.story('CSRF Protection');
    await allure.severity('critical');

    expect(await loginPage.isCsrfTokenPresent(), 'Hidden CSRF token field must exist in form.').toBe(true);
    const token = await loginPage.getCsrfTokenValue();
    expect(token, 'CSRF token value must not be null.').not.toBeNull();
    expect(token.trim().length > 0, 'CSRF token value must not be empty.').toBe(true);
    expect(token.length >= 16, 'CSRF token should be a secure random hash.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_029_Final_Evidence');
  });

  test('LOGIN_TC_030: Security SQL Injection - Nhập payload SQLi vào trường Email', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Session & Security Non-Functional');
    await allure.story('SQL Injection Prevention');
    await allure.severity('critical');

    const sqliPayload = "' OR 1=1--";
    await loginPage.loginExpectingFailure(sqliPayload, envConfig.credentials.adminPassword);

    const validationMsg = await loginPage.getEmailValidationMessage();
    const hasClientValidation = validationMsg.length > 0;
    const hasServerAlert = await loginPage.isErrorAlertDisplayed();
    expect(
      hasClientValidation || hasServerAlert,
      'SQL Injection payload should be safely blocked via HTML5 validation or server rejection alert.'
    ).toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_030_Final_Evidence');
  });

  test('LOGIN_TC_031: Security XSS - Nhập payload XSS vào trường Email', async ({ loginPage, page }) => {
    await allure.epic('Authentication');
    await allure.feature('Session & Security Non-Functional');
    await allure.story('XSS Prevention');
    await allure.severity('critical');

    let unexpectedDialogMessage = '';
    const dialogListener = async (dialog: any) => {
      unexpectedDialogMessage = dialog.message();
      await dialog.dismiss();
    };
    page.on('dialog', dialogListener);

    const xssPayload = "<script>alert('XSS')</script>@test.com";
    await loginPage.loginExpectingFailure(xssPayload, envConfig.credentials.adminPassword);

    expect(
      unexpectedDialogMessage,
      `XSS script executed unexpected alert popup: ${unexpectedDialogMessage}`
    ).toBe('');

    page.off('dialog', dialogListener);
    await loginPage.attachStepScreenshot('LOGIN_TC_031_Final_Evidence');
  });

  test("LOGIN_TC_032: Double Submit Prevention - Nhấp liên tục vào nút 'Login'", async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Session & Security Non-Functional');
    await allure.story('Double Submit Prevention');
    await allure.severity('normal');

    await loginPage.enterEmail(envConfig.credentials.adminEmail);
    await loginPage.enterPassword(envConfig.credentials.adminPassword);

    // Rapid double click
    await loginPage.clickLogin();
    try {
      await loginPage.clickLogin();
    } catch {
      // Ignored if button became disabled or page started unloading
    }

    const { DashboardPage } = await import('../../pages/dashboard.page.js');
    const dashboardPage = new DashboardPage(loginPage.page);
    expect(await dashboardPage.isDashboardDisplayed(), 'Rapid double submit should still cleanly transition to Dashboard.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_032_Final_Evidence');
  });

  test('LOGIN_TC_033: Unicode & UTF-8 - Nhập mật khẩu có ký tự tiếng Việt có dấu và Emoji', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Session & Security Non-Functional');
    await allure.story('Unicode UTF-8 Support');
    await allure.severity('minor');

    const utf8Password = 'MậtKhẩuĐặcBiệt@2026';
    await loginPage.loginExpectingFailure(envConfig.credentials.adminEmail, utf8Password);

    expect(await loginPage.isErrorAlertDisplayed(), 'System must handle Unicode passwords cleanly without server 500 error.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_033_Final_Evidence');
  });

  test('LOGIN_TC_034: Keyboard Accessibility (A11y) - Điều hướng và submit bằng Enter', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Session & Security Non-Functional');
    await allure.story('Keyboard Accessibility');
    await allure.severity('normal');

    await loginPage.enterEmail(envConfig.credentials.adminEmail);
    await loginPage.enterPassword(envConfig.credentials.adminPassword);
    await loginPage.submitViaEnterKey();

    const { DashboardPage } = await import('../../pages/dashboard.page.js');
    const dashboardPage = new DashboardPage(loginPage.page);
    expect(
      await dashboardPage.isDashboardDisplayed(),
      'Pressing Enter key on password input should submit form and navigate to Dashboard.'
    ).toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_034_Final_Evidence');
  });

  test('LOGIN_TC_035: Responsive Layout - Kiểm tra giao diện trên Mobile/Tablet viewport', async ({ loginPage, page }) => {
    await allure.epic('Authentication');
    await allure.feature('Session & Security Non-Functional');
    await allure.story('Responsive Layout');
    await allure.severity('minor');

    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    expect(await loginPage.isLoginPageDisplayed(), 'Form should display properly on Tablet viewport.').toBe(true);

    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    expect(await loginPage.isLoginPageDisplayed(), 'Form should display properly on Mobile viewport.').toBe(true);

    // Restore desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    expect(await loginPage.isLoginPageDisplayed(), 'Form should display properly on Desktop viewport.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_035_Final_Evidence');
  });
});
