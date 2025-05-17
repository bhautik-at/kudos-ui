import { IStorageService } from './interfaces/IStorageService';

// Mock storage implementation for server-side rendering
class NoopStorageService implements IStorageService {
  get<T>(_key: string): T | null {
    return null;
  }

  set<T>(_key: string, _value: T): void {
    // No-op
  }

  remove(_key: string): void {
    // No-op
  }

  clear(): void {
    // No-op
  }

  has(_key: string): boolean {
    return false;
  }
}

export class LocalStorageService implements IStorageService {
  private readonly storage: Storage | null;
  private readonly prefix: string;
  private readonly isServer: boolean;

  constructor(prefix = 'app_') {
    this.isServer = typeof window === 'undefined';
    this.prefix = prefix;

    if (this.isServer) {
      // We're on the server, no localStorage available
      this.storage = null;
    } else {
      // We're in the browser, use real localStorage
      this.storage = window.localStorage;
    }
  }

  /**
   * Get a value from localStorage, with automatic parsing of JSON
   */
  get<T>(key: string): T | null {
    if (this.isServer) return null;

    try {
      const item = this.storage!.getItem(this.getPrefixedKey(key));
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
    if (this.isServer) return;

    try {
      const stringValue = JSON.stringify(value);
      this.storage!.setItem(this.getPrefixedKey(key), stringValue);
    } catch (error) {
      console.error(`Error storing item in localStorage: ${key}`, error);
    }
  }

  /**
   * Remove a value from localStorage
   */
  remove(key: string): void {
    if (this.isServer) return;

    try {
      this.storage!.removeItem(this.getPrefixedKey(key));
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  }

  /**
   * Clear all items stored by this service (only those with the prefix)
   */
  clear(): void {
    if (this.isServer) return;

    try {
      // Only remove items that start with our prefix
      const keysToRemove: string[] = [];

      for (let i = 0; i < this.storage!.length; i++) {
        const key = this.storage!.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => this.storage!.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage items', error);
    }
  }

  /**
   * Check if a key exists in localStorage
   */
  has(key: string): boolean {
    if (this.isServer) return false;
    return this.storage!.getItem(this.getPrefixedKey(key)) !== null;
  }

  /**
   * Add prefix to key for namespace isolation
   */
  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

// Create a singleton instance for consistent usage
export const localStorageService =
  typeof window === 'undefined' ? new NoopStorageService() : new LocalStorageService();
