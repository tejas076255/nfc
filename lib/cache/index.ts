// High-Speed Edge & Worker In-Memory Cache with TTL
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class FastMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxItems = 1000;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    // Prevent memory leaks by evicting oldest if exceeds maxItems
    if (this.cache.size >= this.maxItems) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  deletePrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const fastCache = new FastMemoryCache();

// Helpers for targeted invalidation
export function invalidateProfileCache(slug?: string, id?: string) {
  if (slug) fastCache.delete(`profile:slug:${slug}`);
  if (id) fastCache.delete(`profile:id:${id}`);
  fastCache.deletePrefix("profile:");
}

export function invalidateCardCache(token?: string) {
  if (token) fastCache.delete(`card:token:${token}`);
  fastCache.deletePrefix("card:");
}

export function invalidateQrCache(token?: string) {
  if (token) fastCache.delete(`qr:token:${token}`);
  fastCache.deletePrefix("qr:");
}
