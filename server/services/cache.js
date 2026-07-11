import { logger } from '../utils/logger.js';

class InMemoryCache {
  constructor() {
    this.store = new Map();
    logger.info('[Cache] Initialized In-Memory Caching provider.');
  }

  async get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Check expiry
    if (entry.expiry && entry.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key, value, ttlSeconds = 3600) {
    const expiry = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null;
    this.store.set(key, { value, expiry });
    return true;
  }

  async delete(key) {
    return this.store.delete(key);
  }

  async clear() {
    this.store.clear();
    return true;
  }
}

// Pluggable abstract client factory
class CacheService {
  constructor() {
    // In future, if REDIS_URL is provided, we can dynamically load and use Redis
    this.client = new InMemoryCache();
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, value, ttlSeconds) {
    return this.client.set(key, value, ttlSeconds);
  }

  async delete(key) {
    return this.client.delete(key);
  }

  async clear() {
    return this.client.clear();
  }
}

export const cache = new CacheService();
export default cache;
