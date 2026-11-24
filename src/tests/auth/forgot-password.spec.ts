import { test, expect } from '../../fixtures/base.fixture.js';
import { envConfig } from '../../config/env.config.js';
import { TestDataGenerator } from '../../utils/test-data.generator.js';
import * as allure from 'allure-js-commons';

test.describe('Forgot Password Feature Test Suite', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.parentSuite('chromium');
    await allure.suite('Login Page');
    await allure.subSuite('Forgot Password');
    await loginPage.open();
  });

  test("LOGIN_TC_024: Navigation - Nhấp link 'Forgot Password?' chuyển hướng đúng trang", async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Forgot Password Feature');
    await allure.story('Navigation to Forgot Password');
    await allure.severity('normal');

    const forgotPasswordPage = await loginPage.clickForgotPassword();

    expect(forgotPasswordPage.getURL(), 'User should be navigated to forgot_password URL.').toContain('/forgot_password');
    expect(await forgotPasswordPage.isForgotPasswordPageDisplayed(), 'Forgot password form should be visible.').toBe(true);
    expect(await forgotPasswordPage.getPageHeading(), "Heading must be 'Forgot Password'.").toBe('Forgot Password');

    await forgotPasswordPage.attachStepScreenshot('LOGIN_TC_024_Final_Evidence');
  });

  test('LOGIN_TC_025: Forgot Password - Bỏ trống trường Email Address (HTML5 validation)', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Forgot Password Feature');
    await allure.story('Forgot Password Validation');
    await allure.severity('normal');

    const forgotPasswordPage = await loginPage.clickForgotPassword();
    await forgotPasswordPage.submitForgotPassword('');

    const validationMsg = await forgotPasswordPage.getEmailValidationMessage();
    const hasAlert = await forgotPasswordPage.isAlertDisplayed();
    const hasValidationOrAlert = validationMsg.length > 0 || hasAlert;
    expect(hasValidationOrAlert, 'Form submission should be blocked for empty email (HTML5 validation or alert).').toBe(true);

    await forgotPasswordPage.attachStepScreenshot('LOGIN_TC_025_Final_Evidence');
  });

  test("LOGIN_TC_026: Forgot Password - Nhập email sai định dạng (thiếu '@')", async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Forgot Password Feature');
    await allure.story('Forgot Password Validation');
    await allure.severity('normal');

    const forgotPasswordPage = await loginPage.clickForgotPassword();
    await forgotPasswordPage.submitForgotPassword('bademail');

    const validationMsg = await forgotPasswordPage.getEmailValidationMessage();
    expect(validationMsg.length > 0, "Browser should show HTML5 validation message when '@' is missing.").toBe(true);

    await forgotPasswordPage.attachStepScreenshot('LOGIN_TC_026_Final_Evidence');
  });

  test('LOGIN_TC_027: Forgot Password - Nhập email không tồn tại trong hệ thống', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Forgot Password Feature');
    await allure.story('Forgot Password Unregistered Email');
    await allure.severity('critical');

    const forgotPasswordPage = await loginPage.clickForgotPassword();
    const nonExistentEmail = TestDataGenerator.generateEmail('unregistered');
    await forgotPasswordPage.submitForgotPassword(nonExistentEmail);

    expect(await forgotPasswordPage.isAlertDisplayed(), 'Alert message should be displayed when requesting reset for non-existent email.').toBe(true);
    const alertMsg = await forgotPasswordPage.getAlertMessage();
    expect(
      alertMsg.includes('Email not found') || alertMsg.toLowerCase().includes('email'),
      `Alert message should indicate email is not found or processed. Actual: ${alertMsg}`
    ).toBe(true);

    await forgotPasswordPage.attachStepScreenshot('LOGIN_TC_027_Final_Evidence');
  });

  test('LOGIN_TC_028: Forgot Password - Nhập email hợp lệ đã đăng ký', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Forgot Password Feature');
    await allure.story('Forgot Password Valid Email');
    await allure.severity('critical');

    const forgotPasswordPage = await loginPage.clickForgotPassword();
    await forgotPasswordPage.submitForgotPassword(envConfig.credentials.adminEmail);

    expect(await forgotPasswordPage.isAlertDisplayed(), 'System should display response message after submitting registered email.').toBe(true);

    await forgotPasswordPage.attachStepScreenshot('LOGIN_TC_028_Final_Evidence');
  });
});
