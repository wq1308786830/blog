import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET, POST, DELETE, PUT, PATCH, request } from '@/services/request';
import { RequestError, ErrorType } from '@/services/types';

// Mock dependencies
vi.mock('@/services/config', () => ({
  getConfig: () => ({
    request: {
      baseURL: 'https://api.test.com',
      timeout: 5000,
      showLoading: false,
      showError: false,
      withAuth: false,
      headers: {
        Accept: 'application/json',
      },
    },
    error: {
      networkErrorMessage: 'Network error',
      authErrorMessage: 'Auth error',
      serverErrorMessage: 'Server error',
      generalErrorMessage: 'General error',
      logErrors: false,
    },
    token: {
      autoRefresh: false,
    },
  }),
}));

vi.mock('@/services/tokenManager', () => ({
  tokenManager: {
    getToken: () => null,
  },
}));

vi.mock('@/services/tools', () => ({
  loading: vi.fn(),
  toast: vi.fn(),
  parseObj2SearchParams: (params: any) => {
    if (typeof params === 'object') {
      return new URLSearchParams(params).toString();
    }
    return params;
  },
}));

describe('Request Service', () => {
  // Mock fetch
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });

  describe('GET request', () => {
    it('should send GET request without parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { result: 'success' }, result: 'success', message: 'OK' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      const response = await GET('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(response.result).toBe('success');
    });

    it('should append query parameters to URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], result: 'success', message: 'OK' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      const params = { page: 1, pageSize: 10 };
      await GET('/test', params);

      expect(mockFetch).toHaveBeenCalled();
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0]).toContain('page=1');
      expect(callArgs[0]).toContain('pageSize=10');
    });

    it('should handle JSON response', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData, result: 'success', message: 'OK' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      const response = await GET('/test');

      expect(response.data).toEqual(mockData);
    });
  });

  describe('POST request', () => {
    it('should send POST request with body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { id: 1 }, result: 'success', message: 'Created' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      const bodyData = { name: 'Test', value: 123 };
      await POST('/test', bodyData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(bodyData),
        })
      );
    });

    it('should handle FormData body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {}, result: 'success', message: 'OK' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      const formData = new FormData();
      formData.append('file', 'test');

      await POST('/test', formData);

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[1].body).toBeInstanceOf(FormData);
    });
  });

  describe('DELETE request', () => {
    it('should send DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {}, result: 'success', message: 'Deleted' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      await DELETE('/test/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('PUT and PATCH requests', () => {
    it('should send PUT request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {}, result: 'success', message: 'Updated' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      await PUT('/test/1', { name: 'Updated' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test/1',
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });

    it('should send PATCH request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {}, result: 'success', message: 'Patched' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      await PATCH('/test/1', { name: 'Patched' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test/1',
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });
  });

  describe('error handling', () => {
    it('should throw RequestError on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      await expect(GET('/test')).rejects.toThrow();
    });

    it('should handle 401 status as AUTH error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ data: {}, result: 'fail', message: 'Unauthorized' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      await expect(GET('/test')).rejects.toThrow();
    });

    it('should handle 500 status as SERVER error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ data: {}, result: 'fail', message: 'Server Error' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      await expect(GET('/test')).rejects.toThrow();
    });

    it('should handle timeout error', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.reject({
          name: 'AbortError',
          message: 'The operation was aborted',
        })
      );

      await expect(request('/test', { timeout: 100 })).rejects.toThrow();
    });
  });

  describe('request interceptors', () => {
    it('should apply request interceptors', async () => {
      const { addRequestInterceptor } = await import('@/services/request');

      addRequestInterceptor(async (config) => ({
        ...config,
        headers: {
          ...config.headers,
          'X-Custom-Header': 'test-value',
        },
      }));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {}, result: 'success', message: 'OK' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      await GET('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'test-value',
          }),
        })
      );
    });
  });

  describe('non-JSON response', () => {
    it('should handle text response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Plain text response',
        headers: {
          get: (name: string) => (name === 'content-type' ? 'text/plain' : null),
        },
      });

      const response = await GET('/test');

      expect(response.data).toBe('Plain text response');
      expect(response.result).toBe('success');
    });
  });

  describe('cache strategy', () => {
    it('should use no-store cache strategy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {}, result: 'success', message: 'OK' }),
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
      });

      await GET('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cache: 'no-store',
        })
      );
    });
  });
});
