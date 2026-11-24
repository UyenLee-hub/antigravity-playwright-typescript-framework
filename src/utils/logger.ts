export type LogLevel = 'INFO' | 'STEP' | 'WARN' | 'ERROR' | 'DEBUG';

export class Logger {
  private static formatTime(): string {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  }

  private static log(level: LogLevel, message: string, context?: string): void {
    const ctx = context ? ` [${context}]` : '';
    console.log(`[${this.formatTime()}] [${level}]${ctx} ${message}`);
  }

  public static info(message: string, context?: string): void {
    this.log('INFO', message, context);
  }

  public static step(stepNumberOrName: string | number, message: string, context?: string): void {
    const stepLabel = typeof stepNumberOrName === 'number' ? `Step ${stepNumberOrName}` : stepNumberOrName;
    this.log('STEP', `▶ ${stepLabel}: ${message}`, context);
  }

  public static warn(message: string, context?: string): void {
    this.log('WARN', `⚠️ ${message}`, context);
  }

  public static error(message: string, context?: string): void {
    this.log('ERROR', `❌ ${message}`, context);
  }

  public static debug(message: string, context?: string): void {
    if (process.env.DEBUG === 'true') {
      this.log('DEBUG', `🔍 ${message}`, context);
    }
  }
}
