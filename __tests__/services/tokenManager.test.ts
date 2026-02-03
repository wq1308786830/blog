import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TokenManager, tokenManager } from '@/services/tokenManager';

describe('TokenManager Service', () => {
  let localStorageMock: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Define window and localStorage for Node.js environment
    if (typeof window === 'undefined') {
      (global as any).window = {};
    }
    if (typeof window.localStorage === 'undefined') {
      (global as any).window.localStorage = {};
    }

    // Mock localStorage
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getToken', () => {
    it('should return null when window is undefined', () => {
      // Create manager before deleting window property
      const manager = new TokenManager();

      // Save and delete window temporarily
      const originalWindow = (global as any).window;
      delete (global as any).window;

      const token = manager.getToken();

      expect(token).toBeNull();

      // Restore window
      (global as any).window = originalWindow;
    });

    it('should return token from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('test_token_123');

      const token = tokenManager.getToken();

      expect(token).toBe('test_token_123');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('blog_token');
    });

    it('should return null when token is expired', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'blog_token') return 'test_token_123';
        if (key === 'blog_token_expire') return '1000000000'; // Past timestamp
        return null;
      });

      const token = tokenManager.getToken();

      expect(token).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('blog_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('blog_token_expire');
    });

    it('should return null when localStorage throws error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const token = tokenManager.getToken();

      expect(token).toBeNull();
    });

    it('should return valid token when not expired', () => {
      const futureTimestamp = Date.now() + 1000000;
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'blog_token') return 'test_token_123';
        if (key === 'blog_token_expire') return futureTimestamp.toString();
        return null;
      });

      const token = tokenManager.getToken();

      expect(token).toBe('test_token_123');
    });
  });

  describe('setToken', () => {
    it('should save token to localStorage', () => {
      tokenManager.setToken('new_token_123');

      expect(localStorageMock.setItem).toHaveBeenCalledWith('blog_token', 'new_token_123');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'blog_token_expire',
        expect.any(String)
      );
    });

    it('should set default expiry time (24 hours)', () => {
      const now = Date.now();
      tokenManager.setToken('test_token');

      const expireCall = localStorageMock.setItem.mock.calls.find(
        (call: any[]) => call[0] === 'blog_token_expire'
      );

      const expireTime = parseInt(expireCall[1]);
      expect(expireTime).toBeGreaterThanOrEqual(now + 24 * 60 * 60 * 1000 - 1000);
      expect(expireTime).toBeLessThanOrEqual(now + 24 * 60 * 60 * 1000 + 1000);
    });

    it('should set custom expiry time', () => {
      const customExpiry = 60 * 60 * 1000; // 1 hour
      const now = Date.now();
      tokenManager.setToken('test_token', customExpiry);

      const expireCall = localStorageMock.setItem.mock.calls.find(
        (call: any[]) => call[0] === 'blog_token_expire'
      );

      const expireTime = parseInt(expireCall[1]);
      expect(expireTime).toBeGreaterThanOrEqual(now + customExpiry - 1000);
      expect(expireTime).toBeLessThanOrEqual(now + customExpiry + 1000);
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => tokenManager.setToken('test_token')).not.toThrow();
    });

    it('should do nothing when window is undefined', () => {
      const manager = new TokenManager();

      const originalWindow = (global as any).window;
      delete (global as any).window;

      manager.setToken('test_token');

      expect(localStorageMock.setItem).not.toHaveBeenCalled();

      // Restore
      (global as any).window = originalWindow;
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      tokenManager.removeToken();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('blog_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('blog_token_expire');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => tokenManager.removeToken()).not.toThrow();
    });

    it('should do nothing when window is undefined', () => {
      const manager = new TokenManager();

      const originalWindow = (global as any).window;
      delete (global as any).window;

      manager.removeToken();

      expect(localStorageMock.removeItem).not.toHaveBeenCalled();

      // Restore
      (global as any).window = originalWindow;
    });
  });

  describe('hasToken', () => {
    it('should return true when valid token exists', () => {
      const futureTimestamp = Date.now() + 1000000;
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'blog_token') return 'test_token_123';
        if (key === 'blog_token_expire') return futureTimestamp.toString();
        return null;
      });

      const hasToken = tokenManager.hasToken();

      expect(hasToken).toBe(true);
    });

    it('should return false when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const hasToken = tokenManager.hasToken();

      expect(hasToken).toBe(false);
    });

    it('should return false when token is expired', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'blog_token') return 'test_token_123';
        if (key === 'blog_token_expire') return '1000000000';
        return null;
      });

      const hasToken = tokenManager.hasToken();

      expect(hasToken).toBe(false);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      localStorageMock.setItem.mockImplementation(() => {});

      const result = await tokenManager.refreshToken();

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should handle refresh errors', async () => {
      const manager = new TokenManager();

      // Mock login method to throw error
      manager['login'] = async () => {
        throw new Error('Login failed');
      };

      const result = await manager.refreshToken();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Login failed');
    });

    it('should return same promise for concurrent refresh calls', async () => {
      // 使用新的实例来测试并发
      const manager = new TokenManager();

      // 同时发起两个刷新请求
      const promise1 = manager.refreshToken();
      const promise2 = manager.refreshToken();

      // 验证两个 Promise 返回相同的结果
      const [result1, result2] = await Promise.all([promise1, promise2]);
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.token).toBe(result2.token);
    });

    it('should clear refreshing promise after completion', async () => {
      await tokenManager.refreshToken();

      // Check that the refreshingPromise is cleared
      // This is an internal implementation detail, but we can verify by making another call
      const promise2 = tokenManager.refreshToken();

      expect(promise2).toBeDefined();
      await promise2;
    });
  });

  describe('singleton pattern', () => {
    it('should export singleton instance', () => {
      expect(tokenManager).toBeInstanceOf(TokenManager);
    });

    it('should use same instance across imports', async () => {
      // Import the module again to verify singleton
      const module = await import('@/services/tokenManager');
      const tokenManager2 = module.tokenManager;

      expect(tokenManager).toBe(tokenManager2);
    });
  });
});
