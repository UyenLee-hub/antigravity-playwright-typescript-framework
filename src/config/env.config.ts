import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface AppConfig {
  baseUrl: string;
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  timeouts: {
    default: number;
    expect: number;
    explicitWait: number;
    implicitWait: number;
  };
  retries: number;
  workers: number;
  credentials: {
    adminEmail: string;
    adminPassword: string;
  };
}

export const envConfig: AppConfig = {
  baseUrl: process.env.BASE_URL || 'https://crm.anhtester.com/admin/authentication',
  browser: (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium',
  headless: process.env.HEADLESS === 'true',
  viewport: {
    width: Number(process.env.VIEWPORT_WIDTH) || 1920,
    height: Number(process.env.VIEWPORT_HEIGHT) || 1080,
  },
  timeouts: {
    default: Number(process.env.DEFAULT_TIMEOUT) || 30000,
    expect: Number(process.env.EXPECT_TIMEOUT) || 10000,
    explicitWait: Number(process.env.EXPLICIT_WAIT) || 10000,
    implicitWait: Number(process.env.IMPLICIT_WAIT) || 0,
  },
  retries: Number(process.env.RETRIES) || 0,
  workers: Number(process.env.WORKERS) || 1,
  credentials: {
    adminEmail: process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || '',
    adminPassword: process.env.ADMIN_PASSWORD || '',
  },
};
