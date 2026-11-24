import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { TestInfo } from '@playwright/test';
import { envConfig } from '../config/env.config.js';

export class AllureHelper {
  private static readonly RESULTS_DIR = path.resolve(process.cwd(), 'allure-results');

  /**
   * Detect installed Java version string for Allure environment
   */
  public static getJavaVersion(): string {
    try {
      const output = execSync('java -version 2>&1', { encoding: 'utf-8' });
      const match = output.match(/(?:java|openjdk)\s+version\s+"([^"]+)"/i) ||
                    output.match(/build\s+([^\s,)]+)/i);
      return match && match[1] ? match[1] : '21.0.12.1';
    } catch {
      return '21.0.12.1';
    }
  }

  /**
   * Format current date time as YYYY-MM-DD HH:mm:ss
   */
  public static getCurrentExecutionTime(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const min = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  }

  /**
   * Generates environment.properties required for Allure Report
   * matching user specifications:
   * java.version, execution.Time, OS, Expliccit.Wait, Headless, Base.URL, Browser, Implicit.Wait
   */
  public static generateAllureEnvironment(customBrowser?: string): void {
    if (!fs.existsSync(this.RESULTS_DIR)) {
      fs.mkdirSync(this.RESULTS_DIR, { recursive: true });
    }

    const javaVer = this.getJavaVersion();
    const execTime = this.getCurrentExecutionTime();
    const osPlatform = `${os.type()} ${os.release()} (${os.arch()})`;
    const explicitWait = `${envConfig.timeouts.explicitWait}ms`;
    const headless = envConfig.headless ? 'true' : 'false';
    const baseUrl = envConfig.baseUrl;
    const browser = customBrowser || envConfig.browser;
    const implicitWait = `${envConfig.timeouts.implicitWait}ms (Auto-wait)`;

    const propertiesContent = [
      `java.version=${javaVer}`,
      `execution.Time=${execTime}`,
      `OS=${osPlatform}`,
      `Expliccit.Wait=${explicitWait}`,
      `Headless=${headless}`,
      `Base.URL=${baseUrl}`,
      `Browser=${browser}`,
      `Implicit.Wait=${implicitWait}`,
    ].join('\n');

    const envFilePath = path.join(this.RESULTS_DIR, 'environment.properties');
    fs.writeFileSync(envFilePath, propertiesContent, { encoding: 'utf-8' });
  }

  /**
   * Attach screenshot evidence at the end of each testcase
   */
  public static async attachScreenshotEvidence(
    page: import('@playwright/test').Page,
    testInfo: TestInfo,
    prefixName: string = 'LOGIN_Screenshot_Evidence'
  ): Promise<void> {
    try {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach(prefixName, {
        body: screenshot,
        contentType: 'image/png',
      });
    } catch (error) {
      console.warn(`[AllureHelper] Unable to capture screenshot evidence: ${(error as Error).message}`);
    }
  }
}
