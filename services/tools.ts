import type { LoadingConfig, ToastConfig } from './types';

/**
 * 展示 Loading
 * @param config - Loading 配置
 * 
 * @example
 * ```typescript
 * loading({ isShow: true, content: '正在加载...' });
 * loading({ isShow: false });
 * ```
 */
export function loading(config: LoadingConfig | boolean, content?: string, afterClose?: () => void) {
  // 兼容旧的调用方式
  let finalConfig: LoadingConfig;
  if (typeof config === 'boolean') {
    finalConfig = {
      isShow: config,
      content: content || '正在加载...',
      afterClose,
    };
  } else {
    finalConfig = config;
  }

  if (typeof window === 'undefined') {
    console.log(`[Loading ${finalConfig.isShow ? 'Show' : 'Hide'}]`, finalConfig.content);
    return;
  }

  // 如果有外部 UI 库，这里应该调用
  // 例如：message.loading(finalConfig.content, 0, finalConfig.afterClose);
  
  // 暂时使用 console.log 作为降级方案
  if (finalConfig.isShow) {
    console.log('[Loading]', finalConfig.content);
  } else {
    console.log('[Loading Closed]');
    if (typeof finalConfig.afterClose === 'function') {
      finalConfig.afterClose();
    }
  }
}

/**
 * 展示 Toast 提示
 * @param content - Toast 内容或配置对象
 * @param afterClose - 关闭后的回调函数
 * 
 * @example
 * ```typescript
 * toast('操作成功');
 * toast({ content: '操作成功', afterClose: () => console.log('closed') });
 * ```
 */
export function toast(content: ToastConfig | string, afterClose?: () => void) {
  // 兼容旧的调用方式
  let finalConfig: ToastConfig;
  if (typeof content === 'string') {
    finalConfig = {
      content,
      afterClose,
    };
  } else {
    finalConfig = content;
  }

  if (typeof window === 'undefined') {
    console.log('[Toast]', finalConfig.content);
    return;
  }

  // 如果有外部 UI 库，这里应该调用
  // 例如：message.info(finalConfig.content, 2, finalConfig.afterClose);
  
  // 暂时使用 console.log 作为降级方案
  console.log('[Toast]', finalConfig.content);
  if (typeof finalConfig.afterClose === 'function') {
    finalConfig.afterClose();
  }
}

/**
 * 将对象转换为 URLSearchParams 格式（application/x-www-form-urlencoded）
 * @param obj - 要转换的对象
 * @returns URLSearchParams 字符串
 * 
 * @example
 * ```typescript
 * parseObj2SearchParams({ name: 'test', age: 18 });
 * // 返回: 'name=test&age=18'
 * ```
 */
export function parseObj2SearchParams(obj: Record<string, any> | null | undefined): string {
  if (obj === null || obj === undefined) {
    return '';
  }

  const params: string[] = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      // 跳过 undefined 和 null 值
      if (value !== undefined && value !== null) {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(String(value));
        params.push(`${encodedKey}=${encodedValue}`);
      }
    }
  }

  return params.join('&');
}

/**
 * 将对象转换为 JSON 字符串（用于 application/json）
 * @param obj - 要转换的对象
 * @returns JSON 字符串
 * 
 * @example
 * ```typescript
 * parseObj2JSON({ name: 'test', age: 18 });
 * // 返回: '{"name":"test","age":18}'
 * ```
 */
export function parseObj2JSON(obj: Record<string, any> | null | undefined): string {
  if (obj === null || obj === undefined) {
    return '';
  }
  
  return JSON.stringify(obj);
}

/**
 * 解析 URL 查询参数为对象
 * @param searchParams - URL 查询字符串（如 ?name=test&age=18）
 * @returns 解析后的对象
 * 
 * @example
 * ```typescript
 * parseSearchParams2Obj('?name=test&age=18');
 * // 返回: { name: 'test', age: '18' }
 * ```
 */
export function parseSearchParams2Obj(searchParams: string): Record<string, string> {
  const result: Record<string, string> = {};
  
  if (!searchParams) {
    return result;
  }

  // 移除开头的 ?
  const params = searchParams.startsWith('?') ? searchParams.slice(1) : searchParams;
  
  const pairs = params.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) {
      result[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
    }
  }

  return result;
}

/**
 * 检查是否为浏览器环境
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * 延迟执行
 * @param ms - 延迟毫秒数
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
