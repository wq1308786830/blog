import fetch from 'isomorphic-unfetch';
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
 * 请求拦截器数组
 */
const requestInterceptors: RequestInterceptorFn[] = [];

/**
 * 响应拦截器数组
 */
const responseInterceptors: ResponseInterceptorFn[] = [];

/**
 * 错误拦截器数组
 */
const errorInterceptors: ErrorInterceptorFn[] = [];

/**
 * 添加请求拦截器
 */
export const addRequestInterceptor = (interceptor: RequestInterceptorFn) => {
  requestInterceptors.push(interceptor);
};

/**
 * 添加响应拦截器
 */
export const addResponseInterceptor = (interceptor: ResponseInterceptorFn) => {
  responseInterceptors.push(interceptor);
};

/**
 * 添加错误拦截器
 */
export const addErrorInterceptor = (interceptor: ErrorInterceptorFn) => {
  errorInterceptors.push(interceptor);
};

/**
 * 执行请求拦截器链
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

/**
 * 执行响应拦截器链
 */
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

/**
 * 执行错误拦截器链
 */
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
 * 检查 HTTP 状态码和响应状态
 */
const checkStatus = (response: Response, data?: any): void => {
  // 检查 HTTP 状态码
  if (response.status < 200 || response.status >= 300) {
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

  // 检查业务响应状态
  if (data && data.message === 'GENERAL') {
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
const buildHeaders = (
  requestConfig: ExtendedRequestConfig
): Record<string, string> => {
  const headers: Record<string, string> = {
    ...config.request.headers,
    ...requestConfig.headers,
  };

  // 设置 Content-Type（如果未设置）
  if (!headers['Content-Type'] && requestConfig.body) {
    if (requestConfig.body instanceof FormData) {
      headers['Content-Type'] = ContentType.FORMDATA;
    } else if (requestConfig.body instanceof URLSearchParams) {
      headers['Content-Type'] = ContentType.URLENCODED;
    } else {
      headers['Content-Type'] = config.request.contentType || ContentType.URLENCODED;
    }
  }

  // 注入 Token（如果需要）
  if (!requestConfig.skipAuth && config.request.withAuth) {
    const token = tokenManager.getToken();
    if (token) {
      headers['Authorization'] = token;
    }
  }

  return headers;
};

/**
 * 发送 HTTP 请求的核心函数
 */
const request = async <T = any>(
  url: string,
  options: ExtendedRequestConfig = {}
): Promise<BaseResponse<T>> => {
  // 合并默认配置
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
    loading(true, `请求接口:${buildUrl(url)}\n参数:${JSON.stringify(mergedConfig.body || {})}`);
  }

  try {
    // 执行请求拦截器
    const finalConfig = await applyRequestInterceptors(mergedConfig);

    // 构建 URL 和请求头
    const fullUrl = buildUrl(url, config.request.baseURL);
    const headers = buildHeaders(finalConfig);

    // 发起请求
    const response = await fetch(fullUrl, {
      method: finalConfig.method,
      headers,
      body: finalConfig.body,
    });

    // 解析响应
    const data = await response.json();

    // 检查状态
    checkStatus(response, data);

    // 检查是否需要刷新 Token
    if (isNeedRefreshToken(url, data)) {
      const refreshResult = await tokenManager.refreshToken();
      if (refreshResult.success) {
        // 重新发送请求
        const newHeaders = buildHeaders(finalConfig);
        const retryResponse = await fetch(fullUrl, {
          method: finalConfig.method,
          headers: newHeaders,
          body: finalConfig.body,
        });
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
    const finalData = await applyResponseInterceptors(data, finalConfig);

    return finalData;
  } catch (error: any) {
    // 转换为 RequestError
    const requestError =
      error instanceof RequestError
        ? error
        : new RequestError(
            config.error.networkErrorMessage,
            ErrorType.NETWORK,
            undefined,
            undefined
          );

    // 关闭 Loading 并显示错误
    if (mergedConfig.showLoading) {
      loading(false, undefined, () => {
        if (mergedConfig.showError) {
          toast(requestError.errMessage || config.error.networkErrorMessage);
        }
      });
    } else if (mergedConfig.showError) {
      toast(requestError.errMessage || config.error.networkErrorMessage);
    }

    // 执行错误拦截器
    return applyErrorInterceptors(requestError, mergedConfig);
  } finally {
    // 确保 Loading 被关闭
    if (mergedConfig.showLoading) {
      loading(false, buildUrl(url));
    }
  }
};

/**
 * HTTP 方法工厂函数
 */
const createHttpMethod = (method: HttpMethod) => {
  return async <T = any>(
    url: string,
    params?: any,
    showLoading?: boolean
  ): Promise<BaseResponse<T>> => {
    let finalUrl = url;
    let body: string | URLSearchParams | undefined;

    if (method === 'GET' && params) {
      // GET 请求：参数拼接到 URL
      const searchParams = parseObj2SearchParams(params);
      finalUrl = searchParams ? `${url}?${searchParams}` : url;
    } else if (method !== 'GET' && params) {
      // POST/PUT/DELETE 请求：参数作为 body
      body = parseObj2SearchParams(params);
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
 * 导出核心请求函数（供特殊场景使用）
 */
export { request };
