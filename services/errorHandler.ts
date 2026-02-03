import { RequestError, ErrorType } from './types';
import { getConfig } from './config';

/**
 * 获取配置
 */
const getErrorConfig = () => getConfig().error;

/**
 * 错误处理回调函数类型
 */
export type ErrorCallback = (error: RequestError) => void;

/**
 * 错误处理器配置
 */
export interface ErrorHandlerOptions {
  /** 是否显示错误提示 */
  showError?: boolean;
  /** 是否记录错误日志 */
  logError?: boolean;
  /** 错误回调函数 */
  onError?: ErrorCallback;
}

/**
 * 全局错误回调
 */
let globalErrorCallback: ErrorCallback | null = null;

/**
 * 设置全局错误回调
 */
export const setGlobalErrorCallback = (callback: ErrorCallback) => {
  globalErrorCallback = callback;
};

/**
 * 清除全局错误回调
 */
export const clearGlobalErrorCallback = () => {
  globalErrorCallback = null;
};

/**
 * 获取错误消息
 */
export const getErrorMessage = (error: RequestError): string => {
  // 如果错误对象中有自定义消息，优先使用
  if (error.errMessage) {
    return error.errMessage;
  }

  const config = getErrorConfig();

  // 根据错误类型返回对应的提示消息
  const errorMessages: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: config.networkErrorMessage,
    [ErrorType.AUTH]: config.authErrorMessage,
    [ErrorType.SERVER]: config.serverErrorMessage,
    [ErrorType.BUSINESS]: error.message || config.generalErrorMessage,
    [ErrorType.GENERAL]: config.generalErrorMessage,
    [ErrorType.TIMEOUT]: '请求超时，请稍后重试',
  };

  return errorMessages[error.type] || config.generalErrorMessage;
};

/**
 * 记录错误日志
 */
export const logError = (error: RequestError): void => {
  if (!getErrorConfig().logErrors) {
    return;
  }

  const errorInfo = {
    type: error.type,
    message: error.message,
    code: error.code,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  };

  console.error('[Request Error]', errorInfo);

  // 如果有响应对象，记录响应信息
  if (error.response) {
    console.error('[Response]', {
      status: error.response.status,
      statusText: error.response.statusText,
      url: error.response.url,
    });
  }
};

/**
 * 处理错误
 */
export const handleError = (
  error: RequestError,
  options: ErrorHandlerOptions = {}
): void => {
  const { showError = true, logError: shouldLog = true, onError } = options;

  // 记录错误日志
  if (shouldLog) {
    logError(error);
  }

  // 获取错误消息
  const errorMessage = getErrorMessage(error);

  // 显示错误提示
  if (showError) {
    // 这里应该调用 toast 函数
    // 为了避免循环依赖，这里只是记录
    console.warn('Should show error:', errorMessage);
  }

  // 执行回调函数（优先执行局部回调）
  if (onError) {
    onError(error);
  } else if (globalErrorCallback) {
    globalErrorCallback(error);
  }
};

/**
 * 创建错误处理中间件
 */
export const createErrorMiddleware = (options?: ErrorHandlerOptions) => {
  return (error: RequestError) => {
    handleError(error, options);
    // 继续抛出错误，让调用者能够捕获
    throw error;
  };
};

/**
 * 检查错误是否为特定类型
 */
export const isErrorType = (error: any, type: ErrorType): boolean => {
  return error instanceof RequestError && error.type === type;
};

/**
 * 检查是否为网络错误
 */
export const isNetworkError = (error: any): boolean => {
  return isErrorType(error, ErrorType.NETWORK);
};

/**
 * 检查是否为认证错误
 */
export const isAuthError = (error: any): boolean => {
  return isErrorType(error, ErrorType.AUTH);
};

/**
 * 检查是否为服务器错误
 */
export const isServerError = (error: any): boolean => {
  return isErrorType(error, ErrorType.SERVER);
};

/**
 * 检查是否为业务错误
 */
export const isBusinessError = (error: any): boolean => {
  return isErrorType(error, ErrorType.BUSINESS);
};

/**
 * 检查是否为超时错误
 */
export const isTimeoutError = (error: any): boolean => {
  return isErrorType(error, ErrorType.TIMEOUT);
};
