/**
 * 网络请求模块统一类型定义
 */

/**
 * HTTP 请求方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Content-Type 枚举
 */
export enum ContentType {
  URLENCODED = 'application/x-www-form-urlencoded',
  JSON = 'application/json',
  FORMDATA = 'multipart/form-data',
  TEXT = 'text/plain',
}

/**
 * 基础请求配置接口
 */
export interface RequestConfig {
  /** 请求方法 */
  method?: HttpMethod;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求体 */
  body?: string | FormData | URLSearchParams;
  /** 是否显示 loading */
  showLoading?: boolean;
  /** 是否显示错误提示 */
  showError?: boolean;
  /** 是否跳过认证（不携带 token） */
  skipAuth?: boolean;
  /** 超时时间（毫秒） */
  timeout?: number;
}

/**
 * 扩展的请求配置，包含原始 fetch 选项
 */
export interface ExtendedRequestConfig extends RequestInit {
  /** 是否显示 loading */
  showLoading?: boolean;
  /** 是否显示错误提示 */
  showError?: boolean;
  /** 是否跳过认证（不携带 token） */
  skipAuth?: boolean;
  /** 超时时间（毫秒） */
  timeout?: number;
}

/**
 * 基础响应接口
 */
export interface BaseResponse<T = any> {
  /** 响应数据 */
  data: T;
  /** 响应结果状态 */
  result: 'success' | 'fail';
  /** 响应消息 */
  message: string;
  /** 时间戳 */
  timestamp?: number;
}

/**
 * 带分页的响应数据
 */
export interface PaginatedResponse<T = any> {
  /** 数据列表 */
  list: T[];
  /** 总数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

/**
 * 错误类型枚举
 */
export enum ErrorType {
  /** 网络错误 */
  NETWORK = 'network',
  /** 认证错误（token 失效） */
  AUTH = 'auth',
  /** 服务器错误 */
  SERVER = 'server',
  /** 业务错误 */
  BUSINESS = 'business',
  /** 通用错误 */
  GENERAL = 'general',
  /** 超时错误 */
  TIMEOUT = 'timeout',
}

/**
 * 自定义错误类
 */
export class RequestError extends Error {
  /** 错误类型 */
  type: ErrorType;

  /** 错误码 */
  code?: number;

  /** 原始响应对象 */
  response?: Response;

  /** 错误消息 */
  errMessage?: string;

  constructor(message: string, type: ErrorType, code?: number, response?: Response) {
    super(message);
    this.name = 'RequestError';
    this.type = type;
    this.code = code;
    this.response = response;
  }
}

/**
 * Token 刷新结果
 */
export interface TokenRefreshResult {
  /** 是否刷新成功 */
  success: boolean;
  /** 新的 token */
  token?: string;
  /** 错误信息 */
  error?: string;
}

/**
 * 分类接口（保留原有接口定义）
 */
export interface Category {
  father_id: number;
  id: number;
  level: number;
  name: string;
  subCategory: null | Category[];
}

/**
 * 页面组件 props 类型（保留原有接口定义）
 */
export interface PageProps<T = any> {
  params?: T | any;
  children?: React.ReactNode;
}

/**
 * 文章详情类型（基于实际 API 推断）
 */
export interface Article {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  createTime: string;
  updateTime: string;
  date_publish: number;
  text_type: string;
}

/**
 * 文章列表项类型
 */
export interface ArticleListItem {
  readonly id: number;
  readonly title: string;
  readonly summary?: string;
  readonly categoryId: number;
  readonly createTime: string;
  readonly date_publish: number; // 确保包含这个字段
}

/**
 * 获取文章列表参数类型
 */
export interface GetArticleListParams {
  /** 分类 ID */
  key?: string | number;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/**
 * 获取文章详情参数类型
 */
export interface GetArticleDetailParams {
  articleId: string | number;
}

/**
 * 获取分类参数类型
 */
export interface GetCategoriesParams {
  fatherId?: string | number;
}

/**
 * 删除分类参数类型
 */
export interface DeleteCategoryParams {
  categoryId: string | number;
}

/**
 * 推荐链接类型
 */
export interface RecommendLink {
  id: number;
  title: string;
  url: string;
}

/**
 * Loading 配置
 */
export interface LoadingConfig {
  isShow: boolean;
  content?: string;
  afterClose?: () => void;
}

/**
 * Toast 配置
 */
export interface ToastConfig {
  content: string;
  afterClose?: () => void;
}

/**
 * 请求拦截器函数类型
 */
export type RequestInterceptorFn = (
  config: ExtendedRequestConfig
) => ExtendedRequestConfig | Promise<ExtendedRequestConfig>;

/**
 * 响应拦截器函数类型
 */
export type ResponseInterceptorFn = <T = any>(
  response: BaseResponse<T>,
  config: ExtendedRequestConfig
) => BaseResponse<T> | Promise<BaseResponse<T>>;

/**
 * 错误拦截器函数类型
 */
export type ErrorInterceptorFn = (
  error: RequestError,
  config: ExtendedRequestConfig
) => any | Promise<any>;
