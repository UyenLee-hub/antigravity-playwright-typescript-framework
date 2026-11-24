# 🚀 Playwright TypeScript E2E Automation Framework

> **Enterprise-Ready E2E Web UI Test Automation Framework** được xây dựng với **Playwright Test**, **TypeScript (Strict Mode)**, **Page Object Model (POM)** và tích hợp chuyên sâu **Allure Report**. Framework hiện quản lý và thực thi toàn diện bộ **35 Test Cases** cho ứng dụng **Perfex CRM**.

---

## 📑 Mục Lục

1. [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
2. [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
3. [Danh Sách 35 Test Cases (Perfex CRM)](#-danh-sách-35-test-cases-perfex-crm)
4. [Yêu Cầu Hệ Thống (Prerequisites)](#-yêu-cầu-hệ-thống-prerequisites)
5. [Cài Đặt (Installation)](#-cài-đặt-installation)
6. [Cấu Hình Môi Trường (.env)](#-cấu-hình-môi-trường-env)
7. [Các Lệnh Thực Thi (Command Scripts)](#-các-lệnh-thực-thi-command-scripts)
8. [Xem Báo Cáo Allure (Allure Report)](#-xem-báo-cáo-allure-allure-report)
9. [Kinh Nghiệm & Quy Chuẩn Thiết Kế](#-kinh-nghiệm--quy-chuẩn-thiết-kế)
10. [Tích Hợp CI/CD (GitHub Actions)](#-tích-hợp-cicd-github-actions)

---

## 🌟 Tính Năng Nổi Bật

- **TypeScript Strict Mode:** Bật toàn bộ strict rules (`strict: true`, `noImplicitAny`, `strictNullChecks`) đảm bảo 100% type safety.
- **Page Object Model (POM) Chuẩn Hóa:** Phân tách rõ ràng giữa Base Page (`src/pages/base.page.ts`), Page Objects (`login`, `dashboard`, `forgot-password`), kịch bản kiểm thử (`src/tests`), và Fixtures (`src/fixtures`).
- **Bao Phủ 35 Test Cases Toàn Diện:**
  - **Login Feature (20 TCs):** Hiển thị UI mặc định, HTML5 validation, boundary email/password, trim khoảng trắng, case sensitivity, toggle mask password, happy path login, consecutive failures, logout flow.
  - **Session & Security (10 TCs):** Remember Me cookies, Browser history Back button protection, CSRF hidden token hash, SQL Injection & XSS sanitization, double-submit click, Unicode/UTF-8 password, Keyboard A11y Enter submit, Responsive viewport.
  - **Forgot Password (5 TCs):** Điều hướng, HTML5 empty/format email validation, unregistered email alert, valid email submission.
- **Auto-Waiting & Smart Assertions:** Loại bỏ hoàn toàn hard sleep (`page.waitForTimeout`), sử dụng web-first assertions của Playwright giúp test chạy nhanh và ổn định tuyệt đối.
- **Allure Report Nâng Cao:**
  - **Mục Environment đầy đủ 8 trường:** `OS`, `Browser`, `Base.URL`, `Headless`, `Explicit.Wait`, `Implicit.Wait`, `execution.Time`, `java.version`.
  - **Phân cấp bước cha - con rõ ràng:** Ghi nhận selector và tham số chi tiết ở từng bước `[Locator: "..."]`.
  - **Đính kèm Screenshot thông minh:** Chụp ảnh màn hình ở bước xác nhận cuối của test pass và tự động chụp `FAILURE_SCREENSHOT` khi test fail.
- **CI/CD Pipeline Sẵn Sàng:** Cấu hình GitHub Actions tự động thực thi kiểm thử và xuất bản Allure Report.

---

## 📁 Cấu Trúc Thư Mục

```
playwright-typescript-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml            # CI/CD GitHub Actions Workflow xuất bản Allure Report
├── scripts/
│   └── allure-runner.js              # Runner tương thích đường dẫn Windows & auto-fix JAVA_HOME
├── src/
│   ├── config/
│   │   ├── env.config.ts             # Quản lý cấu hình môi trường (.env) strongly-typed
│   │   └── global.setup.ts           # Global Setup sinh Allure Environment Metadata
│   ├── fixtures/
│   │   └── base.fixture.ts           # Custom Fixtures: Tự động inject Page Objects & Failure Screenshot
│   ├── pages/
│   │   ├── base.page.ts              # Base Page: Action wrappers, smart wait, step logging, HTML5 validation
│   │   ├── login.page.ts             # Login Page Object cho Perfex CRM
│   │   ├── dashboard.page.ts         # Dashboard Page Object (User Profile & Logout Flow)
│   │   └── forgot-password.page.ts   # Forgot Password Page Object
│   ├── tests/
│   │   └── auth/
│   │       ├── login.spec.ts                 # 20 Test Cases: Form elements, Validations, Login & Logout
│   │       ├── login-session-security.spec.ts# 10 Test Cases: Remember Me, CSRF, SQLi, XSS, A11y, Responsive
│   │       └── forgot-password.spec.ts       # 5 Test Cases: Navigation, Validation, Password Recovery
│   └── utils/
│       ├── allure.helper.ts          # Allure metadata & screenshot utility
│       ├── logger.ts                 # Structured logger (INFO, STEP, WARN, ERROR)
│       ├── test-data.generator.ts    # Sinh dữ liệu ngẫu nhiên, traceable (email, username, random string)
│       └── wait.helper.ts            # Smart wait helpers
├── test-data/
│   └── users.json                    # Dữ liệu tài khoản & mẫu thông báo kiểm thử
├── .env                              # Biến môi trường cục bộ
├── .env.example                      # Template biến môi trường
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies & command scripts
├── playwright.config.ts              # Playwright master config (Chromium 1920x1080)
├── tsconfig.json                     # TypeScript strict configuration
└── README.md                         # Tài liệu hướng dẫn sử dụng
```

---

## 📋 Danh Sách 35 Test Cases (Perfex CRM)

| Suite | File Test | Số Lượng TC | Mô Tả Nghiệp Vụ |
| :--- | :--- | :---: | :--- |
| **Login Feature** | `src/tests/auth/login.spec.ts` | **20 TCs** | Form mặc định, Validation Email (Empty, Whitespace, Format, Max length, Trim), Validation Password (Empty, Min/Max BVA), Toggle Password, Happy path, Sai mật khẩu, Sai 2 lần liên tiếp, Phân biệt hoa thường, Logout flow |
| **Session & Security** | `src/tests/auth/login-session-security.spec.ts` | **10 TCs** | Remember Me cookies, Browser History Back Protection, CSRF Token inspection, SQL Injection, XSS sanitization, Double Submit, Unicode/UTF-8 password, Keyboard Enter submit, Responsive Mobile/Tablet |
| **Forgot Password** | `src/tests/auth/forgot-password.spec.ts` | **5 TCs** | Điều hướng Forgot Password, HTML5 Empty/Format Email validation, Email không tồn tại, Submit email đã đăng ký thành công |

---

## 💻 Yêu Cầu Hệ Thống (Prerequisites)

- **Node.js:** v18 trở lên (khuyến nghị v20+)
- **NPM:** v9 trở lên
- **Java:** v11+ (cần thiết để Allure CLI biên dịch và hiển thị Allure Report)

---

## 📦 Cài Đặt (Installation)

1. Di chuyển vào thư mục framework:
```bash
cd playwright-typescript-framework
```

2. Cài đặt các gói phụ thuộc (dependencies):
```bash
npm install
```

3. Cài đặt trình duyệt Playwright (nếu chưa có):
```bash
npx playwright install chromium
```

---

## ⚙️ Cấu Hình Môi Trường (.env)

Tệp `.env` cấu hình ứng dụng đích (Perfex CRM Demo):

```env
# Target Application URL (Perfex CRM Demo)
BASE_URL=https://crm.anhtester.com/admin/authentication

# Browser Execution Settings
BROWSER=chromium
HEADLESS=false
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Timeouts (in milliseconds)
DEFAULT_TIMEOUT=30000
EXPECT_TIMEOUT=10000
EXPLICIT_WAIT=10000
IMPLICIT_WAIT=0

# Retry & Parallel settings
RETRIES=0
WORKERS=1

# Credentials (Perfex CRM Demo)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123456
```

---

## 🧪 Các Lệnh Thực Thi (Command Scripts)

| Lệnh | Mô tả |
|---|---|
| `npm test` | Chạy toàn bộ 35 test cases (chế độ cấu hình trong `.env`) |
| `npm run test:headed` | Mở browser thật (headed mode 1920x1080) để quan sát trực tiếp |
| `npm run test:chromium` | Chỉ chạy trên trình duyệt Chromium |
| `npm run test:failed` | Chỉ chạy lại các test cases bị fail ở lần trước |
| `npm run test:ui` | Mở giao diện tương tác Playwright UI Mode |
| `npm run allure:generate` | Biên dịch Allure Report HTML từ thư mục `allure-results` (kèm cờ `--clean`) |
| `npm run allure:single` | Tạo một file HTML Allure Report duy nhất để gửi hoặc xem offline |
| `npm run allure:open` | Mở Allure Report đã sinh trên trình duyệt |
| `npm run allure:serve` | Khởi chạy local web server hiển thị Allure Report trực tiếp từ kết quả |
| `npm run allure:clean` | Dọn dẹp thư mục báo cáo và kết quả cũ |
| `npm run report` | Tự động sinh báo cáo mới nhất và mở ngay trên trình duyệt |

---

## 📊 Xem Báo Cáo Allure (Allure Report)

### 1. Mở Báo Cáo Nhanh Nhất
Sau khi chạy kiểm thử xong, chạy lệnh:
```bash
npm run allure:open
```
Hoặc khởi chạy web server trực tiếp từ kết quả:
```bash
npm run allure:serve
```

### 2. Sinh Lại Toàn Bộ Báo Cáo Mới Nhất
```bash
npm run report
```
Lệnh này tương đương với:
```bash
npm run allure:generate && npm run allure:open
```

> **Lưu ý:** Lệnh `playwright test` xuất các file kết quả thô vào `allure-results/`. Khi muốn xem báo cáo HTML tĩnh trong `allure-report/`, luôn chạy `npm run allure:generate` để đồng bộ dữ liệu mới nhất.

---

## 💡 Kinh Nghiệm & Quy Chuẩn Thiết Kế

1. **HTML5 Validation Message:** Trích xuất qua `locator.evaluate((node: HTMLInputElement) => node.validationMessage)` để kiểm tra các thông điệp validation mặc định của browser.
2. **Session & Cookie Testing:** Sử dụng `await context.cookies()` kiểm tra sự tồn tại của session cookie (`sp_session`, `remember`).
3. **Ngăn Ngừa Flaky Session:** Đặt `WORKERS=1` trong `.env` để các test case liên quan đến Authentication, Remember Me, Logout chạy tuần tự an toàn, không xung đột tài khoản trên live server.
4. **Allure Nested Step Logging:** Mọi hành vi `click`, `fill`, `getText` trong `BasePage` đều tự động ghi log vào `test.step` kèm locator selector, giúp report Allure rõ ràng và chuyên nghiệp.

---

## 🚀 Tích Hợp CI/CD (GitHub Actions)

Tệp workflow [.github/workflows/playwright.yml](file:///.github/workflows/playwright.yml) đã cấu hình:
- Tự động kích hoạt khi `push` hoặc `pull_request` vào nhánh chính.
- Cài đặt Node.js 20 và Java 21 Temurin.
- Tự động thực thi toàn bộ 35 test cases Playwright và sinh Allure Report.
- Xuất bản tự động lên **GitHub Pages** (nhánh `gh-pages`) để xem trực tiếp online.
- Lưu trữ Artifacts (`allure-report`, `allure-results`, `playwright-test-results`) trong 14 ngày.
