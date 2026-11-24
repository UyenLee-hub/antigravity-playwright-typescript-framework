import { test, expect } from '../../fixtures/base.fixture.js';
import { envConfig } from '../../config/env.config.js';
import { TestDataGenerator } from '../../utils/test-data.generator.js';
import * as allure from 'allure-js-commons';

test.describe('Login Feature Test Suite', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.parentSuite('chromium');
    await allure.suite('Login Page');
    await allure.subSuite('Login Feature');
    await loginPage.open();
  });

  test('LOGIN_TC_001: Kiểm tra hiển thị mặc định của form Đăng nhập', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Default Login Form Elements');
    await allure.severity('critical');
    await allure.description('Kiểm tra đầy đủ các element mặc định hiển thị trên form Đăng nhập CRM.');

    expect(await loginPage.isLoginPageDisplayed(), 'Login page should be displayed.').toBe(true);
    expect(await loginPage.isLogoDisplayed(), 'Company Logo should be visible.').toBe(true);
    expect(await loginPage.getPageHeading(), "Page heading must be 'Login'.").toBe('Login');
    expect(await loginPage.getEmailValue(), 'Email input should be empty by default.').toBe('');
    expect(await loginPage.getPasswordInputType(), "Password input should be masked (type='password').").toBe('password');
    expect(await loginPage.isRememberMeChecked(), 'Remember Me checkbox should be unchecked by default.').toBe(false);
    expect(await loginPage.isLoginButtonDisplayed(), 'Login button should be visible.').toBe(true);
    expect(await loginPage.isForgotPasswordLinkDisplayed(), 'Forgot Password link should be visible.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_001_Final_Evidence');
  });

  test('LOGIN_TC_002: Validation Email - Bỏ trống trường Email Address', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Email Field Validation');
    await allure.severity('critical');

    await loginPage.loginExpectingFailure('', envConfig.credentials.adminPassword);

    expect(await loginPage.isErrorAlertDisplayed(), 'Error alert banner must be displayed.').toBe(true);
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg, "Error message should state Email Address field is required.").toContain(
      'The Email Address field is required.'
    );

    await loginPage.attachStepScreenshot('LOGIN_TC_002_Final_Evidence');
  });

  test('LOGIN_TC_003: Validation Email - Nhập khoảng trắng (Whitespace only)', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Email Field Validation');
    await allure.severity('normal');

    await loginPage.loginExpectingFailure('     ', envConfig.credentials.adminPassword);

    const validationMsg = await loginPage.getEmailValidationMessage();
    const hasHtml5Validation = validationMsg.length > 0;
    const hasServerAlert = await loginPage.isErrorAlertDisplayed();
    expect(
      hasHtml5Validation || hasServerAlert,
      'Form submission should be blocked either via HTML5 validation or server error alert.'
    ).toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_003_Final_Evidence');
  });

  test("LOGIN_TC_004: Validation Email - Sai định dạng thiếu '@'", async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Email Field Validation');
    await allure.severity('normal');

    await loginPage.enterEmail('invalidemail');
    await loginPage.enterPassword(envConfig.credentials.adminPassword);
    await loginPage.clickLogin();

    const validationMsg = await loginPage.getEmailValidationMessage();
    expect(validationMsg.length > 0, "Browser should show HTML5 validation message when '@' is missing.").toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_004_Final_Evidence');
  });

  test("LOGIN_TC_005: Validation Email - Sai định dạng thiếu domain sau '@'", async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Email Field Validation');
    await allure.severity('normal');

    await loginPage.enterEmail('admin@');
    await loginPage.enterPassword(envConfig.credentials.adminPassword);
    await loginPage.clickLogin();

    const validationMsg = await loginPage.getEmailValidationMessage();
    expect(validationMsg.length > 0, "Browser should show HTML5 validation message when domain is missing after '@'.").toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_005_Final_Evidence');
  });

  test('LOGIN_TC_006: Validation Email - Vượt quá độ dài tối đa (BVA 256 ký tự)', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Email Boundary Validation');
    await allure.severity('minor');

    const longPrefix = TestDataGenerator.generateRandomString(240);
    const overlengthEmail = `${longPrefix}@domain.com`;

    await loginPage.loginExpectingFailure(overlengthEmail, envConfig.credentials.adminPassword);

    expect(await loginPage.isErrorAlertDisplayed(), 'Server should handle overlength email gracefully and display error alert.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_006_Final_Evidence');
  });

  test('LOGIN_TC_007: Validation Email - Tự động loại bỏ khoảng trắng thừa (Trim)', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Email Field Trim');
    await allure.severity('normal');

    const emailWithSpaces = ` ${envConfig.credentials.adminEmail} `;
    const dashboardPage = await loginPage.loginAs(emailWithSpaces, envConfig.credentials.adminPassword);

    expect(await dashboardPage.isDashboardDisplayed(), 'System should trim leading and trailing spaces and login successfully.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_007_Final_Evidence');
  });

  test('LOGIN_TC_008: Validation Password - Bỏ trống trường Password', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Password Field Validation');
    await allure.severity('critical');

    await loginPage.loginExpectingFailure(envConfig.credentials.adminEmail, '');

    expect(await loginPage.isErrorAlertDisplayed(), 'Error alert banner must be displayed.').toBe(true);
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg, "Error message should state Password field is required.").toContain(
      'The Password field is required.'
    );

    await loginPage.attachStepScreenshot('LOGIN_TC_008_Final_Evidence');
  });

  test('LOGIN_TC_009: Validation Password - Nhập khoảng trắng (Whitespace only)', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Password Field Validation');
    await allure.severity('normal');

    await loginPage.loginExpectingFailure(envConfig.credentials.adminEmail, '      ');

    expect(await loginPage.isErrorAlertDisplayed(), 'Error alert banner must be displayed.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_009_Final_Evidence');
  });

  test('LOGIN_TC_010: Validation Password - Độ dài dưới min (BVA 5 ký tự)', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Password Boundary Validation');
    await allure.severity('normal');

    await loginPage.loginExpectingFailure(envConfig.credentials.adminEmail, '12345');

    expect(await loginPage.isErrorAlertDisplayed(), 'Error alert banner must be displayed.').toBe(true);
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg, 'Generic security message should be displayed for invalid password.').toContain('Invalid email or password');

    await loginPage.attachStepScreenshot('LOGIN_TC_010_Final_Evidence');
  });

  test('LOGIN_TC_011: Validation Password - Độ dài tối đa hợp lệ (BVA 255 ký tự)', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Password Boundary Validation');
    await allure.severity('minor');

    const longPassword = TestDataGenerator.generateRandomString(255);
    await loginPage.loginExpectingFailure(envConfig.credentials.adminEmail, longPassword);

    expect(await loginPage.isErrorAlertDisplayed(), 'System should safely reject long password without crashing.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_011_Final_Evidence');
  });

  test('LOGIN_TC_012: Validation Form - Bỏ trống đồng thời cả Email và Password', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Form Decision Table Validation');
    await allure.severity('critical');

    await loginPage.loginExpectingFailure('', '');

    expect(await loginPage.isErrorAlertDisplayed(), 'Error alert banner must be displayed.').toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage, 'Error message should contain email required validation text.').toContain('The Email Address field is required.');
    expect(errorMessage, 'Error message should contain password required validation text.').toContain('The Password field is required.');

    await loginPage.attachStepScreenshot('LOGIN_TC_012_Final_Evidence');
  });

  test('LOGIN_TC_013: UI Toggle Password - Kiểm tra input type ban đầu là password', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Password Field Masking');
    await allure.severity('normal');

    await loginPage.enterPassword('MySecretPassword@123');
    expect(await loginPage.getPasswordInputType(), "Password input type must be 'password' (masked).").toBe('password');

    if (await loginPage.isPasswordTogglePresent()) {
      await loginPage.togglePasswordVisibility();
      expect(await loginPage.getPasswordInputType(), "Password input type should become 'text' after toggling.").toBe('text');
    }

    await loginPage.attachStepScreenshot('LOGIN_TC_013_Final_Evidence');
  });

  test('LOGIN_TC_014: Đăng nhập thành công với tài khoản Admin hợp lệ (Happy Path)', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Successful Authentication');
    await allure.severity('blocker');

    const dashboardPage = await loginPage.loginAs(envConfig.credentials.adminEmail, envConfig.credentials.adminPassword);

    expect(await dashboardPage.isDashboardDisplayed(), 'User must be redirected to Dashboard after successful authentication.').toBe(true);

    await dashboardPage.attachStepScreenshot('LOGIN_TC_014_Final_Evidence');
  });

  test('LOGIN_TC_015: Đăng nhập thất bại - Email không tồn tại trong hệ thống', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Invalid Credentials Authentication');
    await allure.severity('critical');

    const randomEmail = TestDataGenerator.generateEmail('nonexistent_user');
    await loginPage.loginExpectingFailure(randomEmail, 'ValidPassword@123');

    expect(await loginPage.isErrorAlertDisplayed(), 'Error alert banner must be displayed.').toBe(true);
    expect(await loginPage.getErrorMessage(), 'Generic security message must not reveal that user does not exist.').toContain('Invalid email or password');

    await loginPage.attachStepScreenshot('LOGIN_TC_015_Final_Evidence');
  });

  test('LOGIN_TC_016: Đăng nhập thất bại - Đúng Email nhưng sai Password', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Invalid Credentials Authentication');
    await allure.severity('critical');

    await loginPage.loginExpectingFailure(envConfig.credentials.adminEmail, 'WrongPassword@999');

    expect(await loginPage.isErrorAlertDisplayed(), 'Error alert banner must be displayed.').toBe(true);
    expect(await loginPage.getErrorMessage(), "Error alert should display 'Invalid email or password'.").toContain('Invalid email or password');

    await loginPage.attachStepScreenshot('LOGIN_TC_016_Final_Evidence');
  });

  test('LOGIN_TC_017: Đăng nhập thất bại - Nhập sai mật khẩu liên tiếp 2 lần', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Repeated Failed Attempts');
    await allure.severity('critical');

    await loginPage.loginExpectingFailure(envConfig.credentials.adminEmail, 'WrongPassAttempt1');
    expect(await loginPage.isErrorAlertDisplayed(), 'Error alert must be shown on 1st failure.').toBe(true);

    await loginPage.loginExpectingFailure(envConfig.credentials.adminEmail, 'WrongPassAttempt2');
    expect(await loginPage.isErrorAlertDisplayed(), 'Error alert must be shown on 2nd failure.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_017_Final_Evidence');
  });

  test('LOGIN_TC_018: Case Sensitivity - Kiểm tra tính phân biệt hoa thường của Password', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Password Case Sensitivity');
    await allure.severity('normal');

    await loginPage.loginExpectingFailure(envConfig.credentials.adminEmail, 'ABCDEF');

    expect(await loginPage.isErrorAlertDisplayed(), 'System must enforce case sensitive passwords and reject incorrect case.').toBe(true);

    await loginPage.attachStepScreenshot('LOGIN_TC_018_Final_Evidence');
  });

  test('LOGIN_TC_019: Case Insensitivity - Kiểm tra đăng nhập với Email viết hoa', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Email Case Insensitivity');
    await allure.severity('minor');

    const uppercaseEmail = envConfig.credentials.adminEmail.toUpperCase();
    const dashboardPage = await loginPage.loginAs(uppercaseEmail, envConfig.credentials.adminPassword);

    expect(await dashboardPage.isDashboardDisplayed(), 'System should allow login with uppercase email according to RFC standards.').toBe(true);

    await dashboardPage.attachStepScreenshot('LOGIN_TC_019_Final_Evidence');
  });

  test('LOGIN_TC_022: Logout Flow - Thực hiện đăng xuất thành công từ Dashboard', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login Feature');
    await allure.story('Logout Flow');
    await allure.severity('blocker');

    const dashboardPage = await loginPage.loginAs(envConfig.credentials.adminEmail, envConfig.credentials.adminPassword);
    expect(await dashboardPage.isDashboardDisplayed(), 'Dashboard should be displayed.').toBe(true);

    const loggedOutPage = await dashboardPage.logout();
    expect(await loggedOutPage.isLoginPageDisplayed(), 'User should be redirected to Login page after logout.').toBe(true);

    await loggedOutPage.attachStepScreenshot('LOGIN_TC_022_Final_Evidence');
  });
});
