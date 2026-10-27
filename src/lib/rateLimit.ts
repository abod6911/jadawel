import { NextResponse } from 'next/server';

/**
 * Enterprise-Grade In-Memory Sliding Window Rate Limiter
 * Built for high-concurrency environments with zero external dependencies and memory-leak protection.
 */

interface RateLimitRecord {
  timestamps: number[];
  lastAccessed: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Unix timestamp in seconds
  retryAfter: number; // Seconds until next slot is free
}

export class RateLimiter {
  private records: Map<string, RateLimitRecord> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private maxEntries: number;
  private lastPruned: number = Date.now();

  constructor(maxRequests: number = 30, windowMs: number = 60000, maxEntries: number = 10000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.maxEntries = maxEntries;
  }

  /**
   * Periodic pruning to prevent memory exhaustion under DDoS or millions of unique IPs.
   */
  private autoPrune(now: number): void {
    if (now - this.lastPruned < 30000 && this.records.size < this.maxEntries) {
      return;
    }

    this.lastPruned = now;
    const threshold = now - this.windowMs;

    this.records.forEach((record, key) => {
      if (record.lastAccessed < threshold) {
        this.records.delete(key);
      }
    });

    // Safety guard if still overflowing: remove oldest 20%
    if (this.records.size > this.maxEntries) {
      let count = 0;
      const targetToRemove = Math.floor(this.maxEntries * 0.2);
      this.records.forEach((_, k) => {
        if (count < targetToRemove) {
          this.records.delete(k);
          count++;
        }
      });
    }
  }

  /**
   * Checks whether the request is allowed and returns HTTP rate limit metadata.
   */
  public check(key: string): RateLimitResult {
    const now = Date.now();
    this.autoPrune(now);

    const record = this.records.get(key) || { timestamps: [], lastAccessed: now };
    record.lastAccessed = now;

    // Prune expired timestamps in current window
    const windowStart = now - this.windowMs;
    const activeTimestamps = record.timestamps.filter((ts) => ts > windowStart);

    const resetTime = Math.ceil((now + this.windowMs) / 1000);

    if (activeTimestamps.length >= this.maxRequests) {
      const oldestActive = activeTimestamps[0] || now;
      const retryAfter = Math.max(1, Math.ceil((oldestActive + this.windowMs - now) / 1000));
      this.records.set(key, { timestamps: activeTimestamps, lastAccessed: now });

      return {
        allowed: false,
        limit: this.maxRequests,
        remaining: 0,
        resetTime,
        retryAfter,
      };
    }

    activeTimestamps.push(now);
    this.records.set(key, { timestamps: activeTimestamps, lastAccessed: now });

    return {
      allowed: true,
      limit: this.maxRequests,
      remaining: Math.max(0, this.maxRequests - activeTimestamps.length),
      resetTime,
      retryAfter: 0,
    };
  }

  /**
   * Backward-compatible simple boolean check
   */
  public isAllowed(key: string): boolean {
    return this.check(key).allowed;
  }

  public reset(key: string): void {
    this.records.delete(key);
  }
}

/**
 * Extracts real client IP behind Cloudflare, Vercel, or Reverse Proxies
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();

  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(',')[0];
    if (firstIp) return firstIp.trim();
  }

  return '127.0.0.1';
}

/**
 * Creates a standardized 429 Too Many Requests response with RFC-compliant headers
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: 'عذراً، لقد تجاوزت الحد المسموح للطلبات. يرجى الانتظار قليلاً.',
      retryAfter: result.retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.resetTime),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}

// Pre-configured Production Limiters
export const weatherApiRateLimiter = new RateLimiter(30, 60000); // 30 req/min per IP
export const reportPlaceRateLimiter = new RateLimiter(5, 60000);  // 5 req/min per IP
export const globalActionRateLimiter = new RateLimiter(15, 30000); // 15 req/30s client-side
