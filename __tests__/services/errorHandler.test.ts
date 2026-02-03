import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RequestError, ErrorType } from '@/services/types';
import * as configModule from '@/services/config';

// Mock config module with test values
vi.mock('@/services/config', async () => {
  return {
    getConfig: vi.fn(() => ({
      request: {
        baseURL: 'https://api.test.com',
        timeout: 10000,
      },
      token: {
        storageKey: 'blog_token',
        expiresIn: 24 * 60 * 60 * 1000,
        autoRefresh: true,
        refreshRetryCount: 1,
      },
      error: {
        networkErrorMessage: 'Network error',
        authErrorMessage: 'Auth error',
        serverErrorMessage: 'Server error',
        generalErrorMessage: 'General error',
        logErrors: true,
      },
      ui: {
        loadingText: 'Loading...',
        loadingCloseDelay: 0,
        toastDuration: 2000,
      },
    })),
    getEnvironment: () => 'test',
    getApiBaseUrl: () => 'https://api.test.com',
  };
});

// Import errorHandler after mock is defined
import {
  getErrorMessage,
  logError,
  handleError,
  setGlobalErrorCallback,
  clearGlobalErrorCallback,
  isNetworkError,
  isAuthError,
  isServerError,
  isBusinessError,
  isTimeoutError,
  createErrorMiddleware,
} from '@/services/errorHandler';

describe('ErrorHandler Service', () => {
  let consoleErrorSpy: any;
  let consoleWarnSpy: any;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    clearGlobalErrorCallback();
  });

  describe('getErrorMessage', () => {
    it('should return custom error message if available', () => {
      const error = new RequestError('Custom error', ErrorType.NETWORK);
      error.errMessage = 'Custom message';

      const message = getErrorMessage(error);

      expect(message).toBe('Custom message');
    });

    it('should return network error message for NETWORK type', () => {
      const error = new RequestError('Network error', ErrorType.NETWORK);

      const message = getErrorMessage(error);

      expect(message).toBe('Network error');
    });

    it('should return auth error message for AUTH type', () => {
      const error = new RequestError('Auth failed', ErrorType.AUTH);

      const message = getErrorMessage(error);

      expect(message).toBe('Auth error');
    });

    it('should return server error message for SERVER type', () => {
      const error = new RequestError('Server error', ErrorType.SERVER);

      const message = getErrorMessage(error);

      expect(message).toBe('Server error');
    });

    it('should return general error message for GENERAL type', () => {
      const error = new RequestError('General error', ErrorType.GENERAL);

      const message = getErrorMessage(error);

      expect(message).toBe('General error');
    });

    it('should return timeout message for TIMEOUT type', () => {
      const error = new RequestError('Timeout', ErrorType.TIMEOUT);

      const message = getErrorMessage(error);

      expect(message).toBe('请求超时，请稍后重试');
    });

    it('should return business error message from error.message', () => {
      const error = new RequestError('Business logic error', ErrorType.BUSINESS);

      const message = getErrorMessage(error);

      expect(message).toBe('Business logic error');
    });
  });

  describe('logError', () => {
    it('should log error to console', () => {
      const error = new RequestError('Test error', ErrorType.NETWORK);

      logError(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Request Error]',
        expect.objectContaining({
          type: ErrorType.NETWORK,
          message: 'Test error',
        })
      );
    });

    it('should log response information if available', () => {
      const mockResponse = {
        status: 404,
        statusText: 'Not Found',
        url: 'https://api.test.com/test',
      } as any;

      const error = new RequestError('Not found', ErrorType.NETWORK, 404, mockResponse);

      logError(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Response]',
        expect.objectContaining({
          status: 404,
          statusText: 'Not Found',
        })
      );
    });

    it('should include timestamp in error log', () => {
      const error = new RequestError('Test error', ErrorType.NETWORK);

      logError(error);

      const logCalls = consoleErrorSpy.mock.calls;
      const errorLogCall = logCalls.find((call: any[]) => call[0] === '[Request Error]');

      expect(errorLogCall).toBeDefined();
      expect(errorLogCall[1]).toHaveProperty('timestamp');
    });
  });

  describe('handleError', () => {
    it('should log error by default', () => {
      const error = new RequestError('Test error', ErrorType.NETWORK);

      handleError(error);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should not log error when logError is false', () => {
      const error = new RequestError('Test error', ErrorType.NETWORK);

      handleError(error, { logError: false });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should call custom onError callback', () => {
      const error = new RequestError('Test error', ErrorType.NETWORK);
      const onError = vi.fn();

      handleError(error, { onError });

      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should call global error callback when no local callback', () => {
      const error = new RequestError('Test error', ErrorType.NETWORK);
      const globalCallback = vi.fn();

      setGlobalErrorCallback(globalCallback);
      handleError(error);

      expect(globalCallback).toHaveBeenCalledWith(error);
    });

    it('should prefer local callback over global callback', () => {
      const error = new RequestError('Test error', ErrorType.NETWORK);
      const localCallback = vi.fn();
      const globalCallback = vi.fn();

      setGlobalErrorCallback(globalCallback);
      handleError(error, { onError: localCallback });

      expect(localCallback).toHaveBeenCalledWith(error);
      expect(globalCallback).not.toHaveBeenCalled();
    });

    it('should show warning when showError is true', () => {
      const error = new RequestError('Test error', ErrorType.NETWORK);

      handleError(error, { showError: true });

      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('global error callback', () => {
    it('should set global error callback', () => {
      const callback = vi.fn();

      setGlobalErrorCallback(callback);

      // Verify it's set by triggering an error
      const error = new RequestError('Test error', ErrorType.NETWORK);
      handleError(error);

      expect(callback).toHaveBeenCalledWith(error);
    });

    it('should clear global error callback', () => {
      const callback = vi.fn();

      setGlobalErrorCallback(callback);
      clearGlobalErrorCallback();

      const error = new RequestError('Test error', ErrorType.NETWORK);
      handleError(error);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('error type checkers', () => {
    it('should identify network errors', () => {
      const error = new RequestError('Network error', ErrorType.NETWORK);

      expect(isNetworkError(error)).toBe(true);
      expect(isAuthError(error)).toBe(false);
      expect(isServerError(error)).toBe(false);
    });

    it('should identify auth errors', () => {
      const error = new RequestError('Auth error', ErrorType.AUTH);

      expect(isAuthError(error)).toBe(true);
      expect(isNetworkError(error)).toBe(false);
    });

    it('should identify server errors', () => {
      const error = new RequestError('Server error', ErrorType.SERVER);

      expect(isServerError(error)).toBe(true);
      expect(isNetworkError(error)).toBe(false);
    });

    it('should identify business errors', () => {
      const error = new RequestError('Business error', ErrorType.BUSINESS);

      expect(isBusinessError(error)).toBe(true);
      expect(isNetworkError(error)).toBe(false);
    });

    it('should identify timeout errors', () => {
      const error = new RequestError('Timeout', ErrorType.TIMEOUT);

      expect(isTimeoutError(error)).toBe(true);
      expect(isNetworkError(error)).toBe(false);
    });

    it('should return false for non-RequestError', () => {
      const error = new Error('Regular error');

      expect(isNetworkError(error)).toBe(false);
      expect(isAuthError(error)).toBe(false);
      expect(isServerError(error)).toBe(false);
      expect(isBusinessError(error)).toBe(false);
      expect(isTimeoutError(error)).toBe(false);
    });
  });

  describe('createErrorMiddleware', () => {
    it('should create middleware that handles error', () => {
      const error = new RequestError('Test error', ErrorType.NETWORK);
      const middleware = createErrorMiddleware({ showError: false });

      expect(() => middleware(error)).toThrow();
    });

    it('should apply custom options to middleware', () => {
      const error = new RequestError('Test error', ErrorType.NETWORK);
      const onError = vi.fn();
      const middleware = createErrorMiddleware({ onError, logError: false });

      try {
        middleware(error);
      } catch (e) {
        // Expected to throw
      }

      expect(onError).toHaveBeenCalledWith(error);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
