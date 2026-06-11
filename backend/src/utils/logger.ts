export const logger = {
  info: (...args: any[]) => console.log(`[${new Date().toISOString()}] ℹ️ `, ...args),
  error: (...args: any[]) => console.error(`[${new Date().toISOString()}] ❌`, ...args),
  warn: (...args: any[]) => console.warn(`[${new Date().toISOString()}] ⚠️ `, ...args),
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${new Date().toISOString()}] 🐛`, ...args);
    }
  },
};
