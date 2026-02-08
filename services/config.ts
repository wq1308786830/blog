import { ContentType, HttpMethod } from './types';

/**
 * 环境类型
 */
export type Environment = 'development' | 'test' | 'production';

/**
 * 获取当前环境
 */
export const getEnvironment = (): Environment => {
  const env = process.env.NODE_ENV as Environment;
  return env || 'development';
};

/**
 * API 基础路径配置
 */
export const API_BASE_URLS: Record<Environment, string> = {
  development: 'https://blog-proxy-nine.vercel.app',
  test: 'https://blog-proxy-nine.vercel.app',
  production: 'https://blog-proxy-nine.vercel.app',
};

/**
 * 获取当前环境的 API 基础路径
 */
export const getApiBaseUrl = (): string => {
  const env = getEnvironment();
  return API_BASE_URLS[env];
};

/**
 * 请求默认配置接口
 */
export interface RequestDefaultConfig {
  /** 基础 URL */
  baseURL?: string;
  /** 请求超时时间（毫秒） */
  timeout?: number;
  /** 默认 Content-Type */
  contentType?: ContentType;
  /** 是否默认显示 loading */
  showLoading?: boolean;
  /** 是否默认显示错误提示 */
  showError?: boolean;
  /** 是否默认携带 Token */
  withAuth?: boolean;
  /** 默认请求头 */
  headers?: Record<string, string>;
}

/**
 * 基于环境的不同配置
 */
export const ENV_CONFIGS: Record<Environment, RequestDefaultConfig> = {
  development: {
    timeout: 30000,
    showLoading: false,
    showError: true,
    withAuth: true,
    contentType: ContentType.URLENCODED,
    headers: {
      Accept: 'application/json',
    },
  },
  test: {
    timeout: 20000,
    showLoading: true,
    showError: true,
    withAuth: true,
    contentType: ContentType.URLENCODED,
    headers: {
      Accept: 'application/json',
    },
  },
  production: {
    timeout: 15000,
    showLoading: false,
    showError: true,
    withAuth: true,
    contentType: ContentType.URLENCODED,
    headers: {
      Accept: 'application/json',
    },
  },
};

/**
 * 获取当前环境的默认配置
 */
export const getDefaultConfig = (): RequestDefaultConfig => {
  const env = getEnvironment();
  const config = ENV_CONFIGS[env];
  
  return {
    baseURL: getApiBaseUrl(),
    ...config,
  };
};

/**
 * Token 相关配置
 */
export interface TokenConfig {
  /** Token 存储键名 */
  storageKey: string;
  /** Token 有效期（毫秒） */
  expiresIn: number;
  /** 是否在请求失败时自动刷新 Token */
  autoRefresh: boolean;
  /** Token 失败的重试次数 */
  refreshRetryCount: number;
}

/**
 * 默认 Token 配置
 */
export const DEFAULT_TOKEN_CONFIG: TokenConfig = {
  storageKey: 'blog_token',
  expiresIn: 24 * 60 * 60 * 1000, // 24 小时
  autoRefresh: true,
  refreshRetryCount: 1,
};

/**
 * 错误处理配置
 */
export interface ErrorHandlingConfig {
  /** 网络错误提示 */
  networkErrorMessage: string;
  /** 服务器错误提示 */
  serverErrorMessage: string;
  /** Token 失效提示 */
  authErrorMessage: string;
  /** 通用错误提示 */
  generalErrorMessage: string;
  /** 是否在控制台输出错误 */
  logErrors: boolean;
}

/**
 * 默认错误处理配置
 */
export const DEFAULT_ERROR_CONFIG: ErrorHandlingConfig = {
  networkErrorMessage: '网络错误~',
  serverErrorMessage: '服务器错误~',
  authErrorMessage: '登录已过期，请重新登录',
  generalErrorMessage: '哎呀，系统开小差啦！',
  logErrors: true,
};

/**
 * UI 反馈配置
 */
export interface UIConfig {
  /** Loading 文案 */
  loadingText: string;
  /** Loading 关闭延迟（毫秒） */
  loadingCloseDelay: number;
  /** Toast 显示时长（毫秒） */
  toastDuration: number;
}

/**
 * 默认 UI 配置
 */
export const DEFAULT_UI_CONFIG: UIConfig = {
  loadingText: '正在加载...',
  loadingCloseDelay: 0,
  toastDuration: 2000,
};

/**
 * 完整的请求配置
 */
export interface RequestConfigOptions {
  /** 默认请求配置 */
  request?: RequestDefaultConfig;
  /** Token 配置 */
  token?: TokenConfig;
  /** 错误处理配置 */
  error?: ErrorHandlingConfig;
  /** UI 反馈配置 */
  ui?: UIConfig;
}

/**
 * 获取完整配置（支持自定义覆盖）
 */
export const getConfig = (options?: RequestConfigOptions) => {
  const defaultRequestConfig = getDefaultConfig();
  
  return {
    request: {
      ...defaultRequestConfig,
      ...options?.request,
    },
    token: {
      ...DEFAULT_TOKEN_CONFIG,
      ...options?.token,
    },
    error: {
      ...DEFAULT_ERROR_CONFIG,
      ...options?.error,
    },
    ui: {
      ...DEFAULT_UI_CONFIG,
      ...options?.ui,
    },
  };
};

// 导出默认配置（向后兼容）
export const env = getEnvironment();
export const prefix = getApiBaseUrl();

// 导出 Config（向后兼容）
export const Config = API_BASE_URLS;
