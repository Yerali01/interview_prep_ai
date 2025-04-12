// Cache implementation for topics
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour in milliseconds

type CacheEntry<T> = {
  data: T
  timestamp: number
}

class TopicCache {
  private cache: Map<string, CacheEntry<any>> = new Map()

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if cache entry is expired
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  invalidate(key: string): void {
    this.cache.delete(key)
  }

  invalidateAll(): void {
    this.cache.clear()
  }
}

// Create a singleton instance
const topicCache = new TopicCache()
export default topicCache
