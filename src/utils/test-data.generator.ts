export class TestDataGenerator {
  /**
   * Generate current timestamp string in seconds
   */
  public static getTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Generate random unique email with traceable prefix and timestamp
   * Format: {prefix}_{timestamp}_{random}@auto.test
   */
  public static generateUniqueEmail(prefix: string = 'test_user'): string {
    const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
    return `${prefix}_${this.getTimestamp()}_${randomSuffix}@auto.test`;
  }

  /**
   * Generate random unique email compatible with Selenium TestDataGenerator.generateEmail
   */
  public static generateEmail(prefix: string = 'test_user'): string {
    return this.generateUniqueEmail(prefix);
  }

  /**
   * Generate random unique username
   */
  public static generateUniqueUsername(prefix: string = 'auto_user'): string {
    const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
    return `${prefix}_${this.getTimestamp()}_${randomSuffix}`;
  }

  /**
   * Generate random numeric phone number
   */
  public static generatePhoneNumber(prefix: string = '09'): string {
    const digits = Math.floor(10000000 + Math.random() * 90000000).toString();
    return `${prefix}${digits}`;
  }

  /**
   * Generate random alpha string
   */
  public static generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
