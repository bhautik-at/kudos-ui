import { IStorageService } from './interfaces/IStorageService';

export class LocalStorageService implements IStorageService {
  private readonly storage: Storage;
  private readonly prefix: string;

  constructor(prefix = 'app_') {
    // Make sure we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('LocalStorageService can only be used in browser environments');
    }
    this.storage = window.localStorage;
    this.prefix = prefix;
  }

  /**
   * Get a value from localStorage, with automatic parsing of JSON
   */
  get<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(this.getPrefixedKey(key));
      if (item === null) return null;

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error retrieving item from localStorage: ${key}`, error);
      return null;
    }
  }

  /**
   * Set a value in localStorage, with automatic stringification
   */
  set<T>(key: string, value: T): void {
    try {
      const stringValue = JSON.stringify(value);
      this.storage.setItem(this.getPrefixedKey(key), stringValue);
    } catch (error) {
      console.error(`Error storing item in localStorage: ${key}`, error);
    }
  }

  /**
   * Remove a value from localStorage
   */
  remove(key: string): void {
    try {
      this.storage.removeItem(this.getPrefixedKey(key));
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  }

  /**
   * Clear all items stored by this service (only those with the prefix)
   */
  clear(): void {
    try {
      // Only remove items that start with our prefix
      const keysToRemove: string[] = [];

      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => this.storage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage items', error);
    }
  }

  /**
   * Check if a key exists in localStorage
   */
  has(key: string): boolean {
    return this.storage.getItem(this.getPrefixedKey(key)) !== null;
  }

  /**
   * Add prefix to key for namespace isolation
   */
  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

// Create a singleton instance for consistent usage
export const localStorageService = new LocalStorageService();
