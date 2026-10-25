/**
 * Lightweight client and edge-friendly Sliding Window Rate Limiter
 * Protects against rapid button spamming, automated scraping, and API flooding
 */

interface RateLimitRecord {
  timestamps: number[];
}

export class RateLimiter {
  private records: Map<string, RateLimitRecord> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Checks whether an action by a key (e.g. client IP or action name) is allowed
   */
  public isAllowed(key: string): boolean {
    const now = Date.now();
    const record = this.records.get(key) || { timestamps: [] };

    // Prune expired timestamps
    const activeTimestamps = record.timestamps.filter(
      (ts) => now - ts < this.windowMs
    );

    if (activeTimestamps.length >= this.maxRequests) {
      this.records.set(key, { timestamps: activeTimestamps });
      return false;
    }

    activeTimestamps.push(now);
    this.records.set(key, { timestamps: activeTimestamps });
    return true;
  }

  /**
   * Resets rate limit for a specific key
   */
  public reset(key: string): void {
    this.records.delete(key);
  }
}

// Global default rate limiter: max 15 plan actions per 30 seconds
export const globalActionRateLimiter = new RateLimiter(15, 30000);
