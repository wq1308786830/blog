import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getEnvironment,
  getApiBaseUrl,
  API_BASE_URLS,
  ENV_CONFIGS,
  getDefaultConfig,
  getConfig,
  DEFAULT_TOKEN_CONFIG,
  DEFAULT_ERROR_CONFIG,
  DEFAULT_UI_CONFIG,
} from '@/services/config';
import { ContentType } from '@/services/types';

describe('Config Service', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  describe('getEnvironment', () => {
    it('should return development when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;

      const env = getEnvironment();

      expect(env).toBe('development');
    });

    it('should return development when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';

      const env = getEnvironment();

      expect(env).toBe('development');
    });

    it('should return test when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';

      const env = getEnvironment();

      expect(env).toBe('test');
    });

    it('should return production when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';

      const env = getEnvironment();

      expect(env).toBe('production');
    });
  });

  describe('API_BASE_URLS', () => {
    it('should have URLs for all environments', () => {
      expect(API_BASE_URLS).toHaveProperty('development');
      expect(API_BASE_URLS).toHaveProperty('test');
      expect(API_BASE_URLS).toHaveProperty('production');
    });

    it('should have valid URL format for each environment', () => {
      const urlPattern = /^https?:\/\/.+/;

      expect(API_BASE_URLS.development).toMatch(urlPattern);
      expect(API_BASE_URLS.test).toMatch(urlPattern);
      expect(API_BASE_URLS.production).toMatch(urlPattern);
    });

    it('should use same URL for development and test', () => {
      expect(API_BASE_URLS.development).toBe(API_BASE_URLS.test);
    });
  });

  describe('getApiBaseUrl', () => {
    it('should return development URL in development', () => {
      process.env.NODE_ENV = 'development';

      const url = getApiBaseUrl();

      expect(url).toBe(API_BASE_URLS.development);
    });

    it('should return test URL in test environment', () => {
      process.env.NODE_ENV = 'test';

      const url = getApiBaseUrl();

      expect(url).toBe(API_BASE_URLS.test);
    });

    it('should return production URL in production', () => {
      process.env.NODE_ENV = 'production';

      const url = getApiBaseUrl();

      expect(url).toBe(API_BASE_URLS.production);
    });
  });

  describe('ENV_CONFIGS', () => {
    it('should have configs for all environments', () => {
      expect(ENV_CONFIGS).toHaveProperty('development');
      expect(ENV_CONFIGS).toHaveProperty('test');
      expect(ENV_CONFIGS).toHaveProperty('production');
    });

    it('should have proper timeout for each environment', () => {
      expect(ENV_CONFIGS.development.timeout).toBe(30000);
      expect(ENV_CONFIGS.test.timeout).toBe(20000);
      expect(ENV_CONFIGS.production.timeout).toBe(15000);
    });

    it('should have proper showLoading for each environment', () => {
      expect(ENV_CONFIGS.development.showLoading).toBe(false);
      expect(ENV_CONFIGS.test.showLoading).toBe(true);
      expect(ENV_CONFIGS.production.showLoading).toBe(false);
    });

    it('should have proper showError for each environment', () => {
      expect(ENV_CONFIGS.development.showError).toBe(true);
      expect(ENV_CONFIGS.test.showError).toBe(true);
      expect(ENV_CONFIGS.production.showError).toBe(true);
    });

    it('should have proper withAuth for each environment', () => {
      expect(ENV_CONFIGS.development.withAuth).toBe(true);
      expect(ENV_CONFIGS.test.withAuth).toBe(true);
      expect(ENV_CONFIGS.production.withAuth).toBe(true);
    });

    it('should have proper contentType for each environment', () => {
      expect(ENV_CONFIGS.development.contentType).toBe(ContentType.URLENCODED);
      expect(ENV_CONFIGS.test.contentType).toBe(ContentType.URLENCODED);
      expect(ENV_CONFIGS.production.contentType).toBe(ContentType.URLENCODED);
    });

    it('should have proper headers for each environment', () => {
      expect(ENV_CONFIGS.development.headers).toEqual({
        Accept: 'application/json',
      });
      expect(ENV_CONFIGS.test.headers).toEqual({
        Accept: 'application/json',
      });
      expect(ENV_CONFIGS.production.headers).toEqual({
        Accept: 'application/json',
      });
    });
  });

  describe('getDefaultConfig', () => {
    it('should return config with baseURL', () => {
      process.env.NODE_ENV = 'development';

      const config = getDefaultConfig();

      expect(config).toHaveProperty('baseURL');
      expect(config.baseURL).toBe(getApiBaseUrl());
    });

    it('should merge environment-specific configs', () => {
      process.env.NODE_ENV = 'development';

      const config = getDefaultConfig();

      expect(config.timeout).toBe(30000);
      expect(config.showLoading).toBe(false);
      expect(config.showError).toBe(true);
    });

    it('should return production config in production', () => {
      process.env.NODE_ENV = 'production';

      const config = getDefaultConfig();

      expect(config.timeout).toBe(15000);
      expect(config.showLoading).toBe(false);
    });

    it('should return test config in test environment', () => {
      process.env.NODE_ENV = 'test';

      const config = getDefaultConfig();

      expect(config.timeout).toBe(20000);
      expect(config.showLoading).toBe(true);
    });
  });

  describe('getConfig', () => {
    it('should return complete config with all sections', () => {
      const config = getConfig();

      expect(config).toHaveProperty('request');
      expect(config).toHaveProperty('token');
      expect(config).toHaveProperty('error');
      expect(config).toHaveProperty('ui');
    });

    it('should merge custom request config', () => {
      const customConfig = {
        request: {
          timeout: 10000,
          headers: {
            'X-Custom-Header': 'custom-value',
          },
        },
      };

      const config = getConfig(customConfig);

      expect(config.request.timeout).toBe(10000);
      expect(config.request.headers).toHaveProperty('X-Custom-Header');
    });

    it('should merge custom token config', () => {
      const customConfig = {
        token: {
          storageKey: 'custom_token',
          expiresIn: 3600000,
        },
      };

      const config = getConfig(customConfig);

      expect(config.token.storageKey).toBe('custom_token');
      expect(config.token.expiresIn).toBe(3600000);
    });

    it('should merge custom error config', () => {
      const customConfig = {
        error: {
          networkErrorMessage: 'Custom network error',
          logErrors: false,
        },
      };

      const config = getConfig(customConfig);

      expect(config.error.networkErrorMessage).toBe('Custom network error');
      expect(config.error.logErrors).toBe(false);
    });

    it('should merge custom UI config', () => {
      const customConfig = {
        ui: {
          loadingText: 'Custom loading...',
          toastDuration: 3000,
        },
      };

      const config = getConfig(customConfig);

      expect(config.ui.loadingText).toBe('Custom loading...');
      expect(config.ui.toastDuration).toBe(3000);
    });

    it('should preserve default values for non-customized options', () => {
      const config = getConfig();

      expect(config.request).toEqual(getDefaultConfig());
      expect(config.token).toEqual(DEFAULT_TOKEN_CONFIG);
      expect(config.error).toEqual(DEFAULT_ERROR_CONFIG);
      expect(config.ui).toEqual(DEFAULT_UI_CONFIG);
    });
  });

  describe('DEFAULT_TOKEN_CONFIG', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_TOKEN_CONFIG.storageKey).toBe('blog_token');
      expect(DEFAULT_TOKEN_CONFIG.expiresIn).toBe(24 * 60 * 60 * 1000);
      expect(DEFAULT_TOKEN_CONFIG.autoRefresh).toBe(true);
      expect(DEFAULT_TOKEN_CONFIG.refreshRetryCount).toBe(1);
    });
  });

  describe('DEFAULT_ERROR_CONFIG', () => {
    it('should have correct default messages', () => {
      expect(DEFAULT_ERROR_CONFIG.networkErrorMessage).toBe('网络错误~');
      expect(DEFAULT_ERROR_CONFIG.serverErrorMessage).toBe('服务器错误~');
      expect(DEFAULT_ERROR_CONFIG.authErrorMessage).toBe('登录已过期，请重新登录');
      expect(DEFAULT_ERROR_CONFIG.generalErrorMessage).toBe('哎呀，系统开小差啦！');
    });

    it('should have logErrors enabled by default', () => {
      expect(DEFAULT_ERROR_CONFIG.logErrors).toBe(true);
    });
  });

  describe('DEFAULT_UI_CONFIG', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_UI_CONFIG.loadingText).toBe('正在加载...');
      expect(DEFAULT_UI_CONFIG.loadingCloseDelay).toBe(0);
      expect(DEFAULT_UI_CONFIG.toastDuration).toBe(2000);
    });
  });

  describe('config immutability', () => {
    it('should not mutate original config when getting custom config', () => {
      const originalConfig = getDefaultConfig();
      const customConfig = getConfig({ request: { timeout: 5000 } });

      expect(originalConfig.timeout).not.toBe(5000);
      expect(customConfig.request.timeout).toBe(5000);
    });

    it('should not affect default configs', () => {
      const defaultTokenConfig = { ...DEFAULT_TOKEN_CONFIG };

      const config = getConfig({
        token: { storageKey: 'test_token' },
      });

      expect(DEFAULT_TOKEN_CONFIG.storageKey).toBe(defaultTokenConfig.storageKey);
      expect(config.token.storageKey).toBe('test_token');
    });
  });

  describe('backward compatibility exports', () => {
    it('should export env', async () => {
      // Import directly from the module to test exports
      const configModule = await import('@/services/config');
      expect(configModule.env).toBe(getEnvironment());
    });

    it('should export prefix', async () => {
      const configModule = await import('@/services/config');
      expect(configModule.prefix).toBe(getApiBaseUrl());
    });

    it('should export Config', async () => {
      const configModule = await import('@/services/config');
      expect(configModule.Config).toBe(API_BASE_URLS);
    });
  });
});
