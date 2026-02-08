import { TokenRefreshResult } from './types';

/**
 * Token 存储键名
 */
const TOKEN_STORAGE_KEY = 'blog_token';

/**
 * Token 过期时间键名
 */
const TOKEN_EXPIRE_KEY = 'blog_token_expire';

/**
 * 默认 Token 有效期（24 小时）
 */
const DEFAULT_TOKEN_EXPIRE_TIME = 24 * 60 * 60 * 1000;

/**
 * Token 管理器
 * 负责统一管理 Token 的存储、获取、刷新和清除
 */
class TokenManager {
  /**
   * 正在刷新的 Promise（避免并发刷新）
   */
  private refreshingPromise: Promise<TokenRefreshResult> | null = null;

  /**
   * 获取当前 Token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      // 检查 Token 是否过期
      if (token && this.isTokenExpired()) {
        this.removeToken();
        return null;
      }
      return token;
    } catch (error) {
      console.error('Failed to get token from localStorage:', error);
      return null;
    }
  }

  /**
   * 设置 Token
   * @param token Token 字符串
   * @param expiresIn 有效期（毫秒），默认 24 小时
   */
  setToken(token: string, expiresIn: number = DEFAULT_TOKEN_EXPIRE_TIME): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      // 记录过期时间
      const expireTime = Date.now() + expiresIn;
      localStorage.setItem(TOKEN_EXPIRE_KEY, expireTime.toString());
    } catch (error) {
      console.error('Failed to set token to localStorage:', error);
    }
  }

  /**
   * 移除 Token
   */
  removeToken(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(TOKEN_EXPIRE_KEY);
    } catch (error) {
      console.error('Failed to remove token from localStorage:', error);
    }
  }

  /**
   * 检查 Token 是否存在
   */
  hasToken(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * 检查 Token 是否过期
   */
  private isTokenExpired(): boolean {
    try {
      const expireTime = localStorage.getItem(TOKEN_EXPIRE_KEY);
      if (!expireTime) {
        return false;
      }
      return Date.now() > Number(expireTime);
    } catch {
      return false;
    }
  }

  /**
   * 刷新 Token
   * 使用单例模式避免并发刷新
   */
  async refreshToken(): Promise<TokenRefreshResult> {
    // 如果已有刷新请求在执行，返回同一个 Promise
    if (this.refreshingPromise) {
      return this.refreshingPromise;
    }

    // 创建一个锁，防止并发创建多个 Promise
    const refreshOperation = (async () => {
      try {
        const result = await this.login();
        if (result.success && result.token) {
          this.setToken(result.token);
          return { success: true, token: result.token };
        }
        return { success: false, error: result.error || 'Token refresh failed' };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Token refresh failed',
        };
      }
    })();

    // 设置正在刷新的 Promise
    this.refreshingPromise = refreshOperation;

    try {
      const result = await refreshOperation;
      return result;
    } finally {
      // 清空刷新 Promise
      this.refreshingPromise = null;
    }
  }

  /**
   * 登录获取 Token
   * 注意：这是一个模拟实现，实际项目中应该调用登录接口
   */
  private async login(): Promise<TokenRefreshResult> {
    try {
      // 模拟登录请求
      // 实际项目中这里应该调用登录 API
      const mockToken = this.generateMockToken();
      
      return {
        success: true,
        token: mockToken,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  }

  /**
   * 生成模拟 Token（仅用于演示）
   */
  private generateMockToken(): string {
    // 实际项目中不需要这个方法，应该从登录接口获取
    return 'mock_token_' + Date.now();
  }
}

// 导出单例实例
export const tokenManager = new TokenManager();

// 导出类，方便测试
export { TokenManager };
