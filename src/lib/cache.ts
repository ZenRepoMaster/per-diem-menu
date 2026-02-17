/**
 * In-Memory Cache Implementation
 * 
 * A simple but effective caching solution with TTL (Time To Live) support.
 * Used to reduce API calls to Square and improve response times.
 * 
 * For production, this could be replaced with Redis for distributed caching.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

/**
 * Generic in-memory cache with TTL support
 */
class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  
  // Default TTL: 5 minutes (in milliseconds)
  private defaultTTL: number = 5 * 60 * 1000;

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns Cached value or null if not found/expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds (optional, defaults to 5 minutes)
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl ?? this.defaultTTL);
    
    this.cache.set(key, {
      data,
      expiresAt,
    });
  }

  /**
   * Delete a specific key from the cache
   * @param key - Cache key to delete
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Delete all keys matching a pattern
   * @param pattern - String pattern to match (simple includes check)
   */
  deletePattern(pattern: string): number {
    let count = 0;
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    return count;
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of entries in the cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if a key exists and is not expired
   * @param key - Cache key
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    // Clean up expired entries first
    this.cleanup();
    
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Remove all expired entries from the cache
   */
  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const cache = new MemoryCache();

// Cache key generators for consistent key naming
export const CacheKeys = {
  /**
   * Generate cache key for locations
   */
  locations: () => 'square:locations',
  
  /**
   * Generate cache key for catalog items by location
   */
  catalog: (locationId: string) => `square:catalog:${locationId}`,
  
  /**
   * Generate cache key for categories by location
   */
  categories: (locationId: string) => `square:categories:${locationId}`,
} as const;

// Cache TTL values (in milliseconds)
export const CacheTTL = {
  /** Locations rarely change - cache for 10 minutes */
  LOCATIONS: 10 * 60 * 1000,
  
  /** Catalog items may change more frequently - cache for 5 minutes */
  CATALOG: 5 * 60 * 1000,
  
  /** Categories - same as catalog */
  CATEGORIES: 5 * 60 * 1000,
} as const;
