import { FullConfig } from '@playwright/test';
import { AllureHelper } from '../utils/allure.helper.js';

export default async function globalSetup(config: FullConfig): Promise<void> {
  const browserProject = config.projects[0]?.name || 'chromium';
  AllureHelper.generateAllureEnvironment(browserProject);
}
