// Cache manager to prevent duplicate keys and improve caching
class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, any> = new Map();
  private timestamps: Map<string, number> = new Map();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Generate a unique cache key
  generateKey(prefix: string, identifier: string): string {
    return `${prefix}-${identifier}`;
  }

  // Set cache with TTL
  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + ttl);
  }

  // Get cache if not expired
  get(key: string): any | null {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() > timestamp) {
      this.delete(key);
      return null;
    }
    return this.cache.get(key) || null;
  }

  // Delete cache
  delete(key: string): void {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.timestamps.clear();
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() > timestamp) {
      this.delete(key);
      return false;
    }
    return this.cache.has(key);
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, timestamp] of this.timestamps.entries()) {
      if (now > timestamp) {
        this.delete(key);
      }
    }
  }
}

// Local storage wrapper with better error handling
export class LocalStorageCache {
  private static readonly PREFIX = 'mintellect-cache';
  private static readonly SEPARATOR = '::';

  static set(key: string, data: any, ttl: number = 24 * 60 * 60 * 1000): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl,
        expires: Date.now() + ttl
      };
      
      localStorage.setItem(
        `${this.PREFIX}${this.SEPARATOR}${key}`,
        JSON.stringify(cacheData)
      );
      return true;
    } catch (error) {
      console.warn('Failed to set cache:', error);
      return false;
    }
  }

  static get(key: string): any | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const cached = localStorage.getItem(`${this.PREFIX}${this.SEPARATOR}${key}`);
      if (!cached) return null;
      
      const parsed = JSON.parse(cached);
      if (Date.now() > parsed.expires) {
        this.delete(key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn('Failed to get cache:', error);
      this.delete(key);
      return null;
    }
  }

  static delete(key: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(`${this.PREFIX}${this.SEPARATOR}${key}`);
      return true;
    } catch (error) {
      console.warn('Failed to delete cache:', error);
      return false;
    }
  }

  static clear(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      }
      return true;
    } catch (error) {
      console.warn('Failed to clear cache:', error);
      return false;
    }
  }

  static getAllKeys(): string[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.PREFIX))
        .map(key => key.replace(`${this.PREFIX}${this.SEPARATOR}`, ''));
    } catch (error) {
      console.warn('Failed to get cache keys:', error);
      return [];
    }
  }
}

export const cacheManager = CacheManager.getInstance();
export default CacheManager;





