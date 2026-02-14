/**
 * React 19 & Next.js 16 优化的网络请求模块
 * 使用原生 fetch API，移除 isomorphic-unfetch 依赖
 */

import {
  HttpMethod,
  BaseResponse,
  RequestError,
  ErrorType,
  ExtendedRequestConfig,
  RequestInterceptorFn,
  ResponseInterceptorFn,
  ErrorInterceptorFn,
  ContentType,
} from './types';
import { getConfig } from './config';
import { tokenManager } from './tokenManager';
import { loading, toast, parseObj2SearchParams } from './tools';

/**
 * 获取配置
 */
const config = getConfig();

/**
 * 拦截器数组
 */
const requestInterceptors: RequestInterceptorFn[] = [];
const responseInterceptors: ResponseInterceptorFn[] = [];
const errorInterceptors: ErrorInterceptorFn[] = [];

/**
 * 添加拦截器的方法
 */
export const addRequestInterceptor = (interceptor: RequestInterceptorFn): void => {
  requestInterceptors.push(interceptor);
};

export const addResponseInterceptor = (interceptor: ResponseInterceptorFn): void => {
  responseInterceptors.push(interceptor);
};

export const addErrorInterceptor = (interceptor: ErrorInterceptorFn): void => {
  errorInterceptors.push(interceptor);
};

/**
 * 执行拦截器链
 */
const applyRequestInterceptors = async (
  requestConfig: ExtendedRequestConfig
): Promise<ExtendedRequestConfig> => {
  let config = requestConfig;
  for (const interceptor of requestInterceptors) {
    config = await interceptor(config);
  }
  return config;
};

const applyResponseInterceptors = async <T = any>(
  response: BaseResponse<T>,
  requestConfig: ExtendedRequestConfig
): Promise<BaseResponse<T>> => {
  let data = response;
  for (const interceptor of responseInterceptors) {
    data = await interceptor(data, requestConfig);
  }
  return data;
};

const applyErrorInterceptors = async (
  error: RequestError,
  requestConfig: ExtendedRequestConfig
): Promise<any> => {
  for (const interceptor of errorInterceptors) {
    const result = await interceptor(error, requestConfig);
    if (result !== undefined) {
      return result;
    }
  }
  throw error;
};

/**
 * 检查响应状态
 */
const checkStatus = (response: Response, data?: any): void => {
  if (!response.ok) {
    const errorType =
      response.status === 401 || response.status === 403
        ? ErrorType.AUTH
        : response.status >= 500
        ? ErrorType.SERVER
        : ErrorType.NETWORK;

    throw new RequestError(
      config.error.networkErrorMessage,
      errorType,
      response.status,
      response
    );
  }

  if (data?.message === 'GENERAL') {
    throw new RequestError(config.error.generalErrorMessage, ErrorType.GENERAL);
  }
};

/**
 * 检查是否需要刷新 Token
 */
const isNeedRefreshToken = (url: string, response: BaseResponse): boolean => {
  return (
    !url.includes('login') &&
    response.result === 'fail' &&
    response.message === 'token失效' &&
    config.token.autoRefresh
  );
};

/**
 * 构建完整的 URL
 */
const buildUrl = (url: string, baseURL?: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${baseURL || config.request.baseURL}${url}`;
};

/**
 * 构建请求头
 */
const buildHeaders = (requestConfig: ExtendedRequestConfig): HeadersInit => {
  const headers: HeadersInit = {
    ...config.request.headers,
    ...requestConfig.headers,
  };

  // 如果 headers 是 Headers 对象，转换为普通对象
  if (headers instanceof Headers) {
    const headersObj: Record<string, string> = {};
    headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    return headersObj;
  }

  // 如果是数组，转换为对象
  if (Array.isArray(headers)) {
    const headersObj: Record<string, string> = {};
    headers.forEach(([key, value]) => {
      headersObj[key] = value;
    });
    return headersObj;
  }

  const headersObj = headers as Record<string, string>;

  // 设置 Content-Type
  if (!headersObj['Content-Type'] && requestConfig.body) {
    if (requestConfig.body instanceof FormData) {
      // FormData 会自动设置 Content-Type，包含 boundary
      delete headersObj['Content-Type'];
    } else if (requestConfig.body instanceof URLSearchParams) {
      headersObj['Content-Type'] = ContentType.URLENCODED;
    } else if (typeof requestConfig.body === 'string') {
      try {
        JSON.parse(requestConfig.body);
        headersObj['Content-Type'] = ContentType.JSON;
      } catch {
        headersObj['Content-Type'] = ContentType.URLENCODED;
      }
    }
  }

  // 注入 Token
  if (!requestConfig.skipAuth && config.request.withAuth) {
    const token = tokenManager.getToken();
    if (token) {
      headersObj['Authorization'] = token;
    }
  }

  return headersObj;
};

/**
 * 创建带超时的 fetch
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new RequestError('请求超时', ErrorType.TIMEOUT);
    }
    throw error;
  }
};

/**
 * 核心请求函数 - React 19 & Next.js 16 优化
 */
const request = async <T = any>(
  url: string,
  options: ExtendedRequestConfig = {}
): Promise<BaseResponse<T>> => {
  const mergedConfig: ExtendedRequestConfig = {
    method: 'GET',
    timeout: config.request.timeout,
    showLoading: config.request.showLoading,
    showError: config.request.showError,
    skipAuth: false,
    ...options,
  };

  // 显示 Loading
  if (mergedConfig.showLoading) {
    loading(true, `请求接口:${buildUrl(url)}`);
  }

  try {
    // 执行请求拦截器
    const finalConfig = await applyRequestInterceptors(mergedConfig);

    // 构建请求参数
    const fullUrl = buildUrl(url, config.request.baseURL);
    const headers = buildHeaders(finalConfig);

    // 发起请求 - 使用原生 fetch
    const response = await fetchWithTimeout(
      fullUrl,
      {
        method: finalConfig.method,
        headers,
        body: finalConfig.body,
        cache: 'no-store', // Next.js 16 缓存策略
      },
      finalConfig.timeout
    );

    // 解析响应
    let data: BaseResponse<T>;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      // 处理非 JSON 响应
      const text = await response.text();
      data = {
        data: text as T,
        result: 'success',
        message: 'OK',
      };
    }

    // 检查状态
    checkStatus(response, data);

    // 检查是否需要刷新 Token
    if (isNeedRefreshToken(url, data)) {
      const refreshResult = await tokenManager.refreshToken();
      if (refreshResult.success) {
        // 重新发送请求
        const newHeaders = buildHeaders(finalConfig);
        const retryResponse = await fetchWithTimeout(
          fullUrl,
          {
            method: finalConfig.method,
            headers: newHeaders,
            body: finalConfig.body,
          },
          finalConfig.timeout
        );
        const retryData = await retryResponse.json();
        checkStatus(retryResponse, retryData);
        return await applyResponseInterceptors(retryData, finalConfig);
      } else {
        throw new RequestError(
          config.error.authErrorMessage,
          ErrorType.AUTH,
          response.status,
          response
        );
      }
    }

    // 执行响应拦截器
    return await applyResponseInterceptors(data, finalConfig);

  } catch (error: any) {
    // 转换为 RequestError
    const requestError =
      error instanceof RequestError
        ? error
        : new RequestError(
            error.message || config.error.networkErrorMessage,
            ErrorType.NETWORK,
            undefined,
            undefined
          );

    // 显示错误
    if (mergedConfig.showError) {
      toast(requestError.errMessage || config.error.networkErrorMessage);
    }

    // 执行错误拦截器
    return applyErrorInterceptors(requestError, mergedConfig);
  } finally {
    // 关闭 Loading
    if (mergedConfig.showLoading) {
      loading(false, buildUrl(url));
    }
  }
};

/**
 * HTTP 方法工厂函数 - React 19 优化
 */
const createHttpMethod = (method: HttpMethod) => {
  return async <T = any>(
    url: string,
    params?: any,
    showLoading?: boolean
  ): Promise<BaseResponse<T>> => {
    let finalUrl = url;
    let body: string | URLSearchParams | FormData | undefined;

    if (method === 'GET' && params) {
      // GET 请求：参数拼接到 URL
      const searchParams = parseObj2SearchParams(params);
      finalUrl = searchParams ? `${url}?${searchParams}` : url;
    } else if (method !== 'GET' && params) {
      // POST/PUT/DELETE 请求：参数作为 body
      if (params instanceof FormData) {
        body = params;
      } else if (typeof params === 'object') {
        // 优先使用 JSON 格式
        body = JSON.stringify(params);
      } else {
        body = parseObj2SearchParams(params);
      }
    }

    return request<T>(finalUrl, {
      method,
      body,
      showLoading,
    });
  };
};

/**
 * 导出 HTTP 方法
 */
export const GET = createHttpMethod('GET');
export const POST = createHttpMethod('POST');
export const PUT = createHttpMethod('PUT');
export const DELETE = createHttpMethod('DELETE');
export const PATCH = createHttpMethod('PATCH');

/**
 * 导出核心请求函数
 */
export { request };

/**
 * React 19 专用的 Suspense 兼容请求函数
 */
export const suspenseRequest = <T = any>(
  url: string,
  options?: ExtendedRequestConfig
): Promise<BaseResponse<T>> => {
  return request<T>(url, {
    ...options,
    showLoading: false, // Suspense 模式下不显示 loading
  });
};
