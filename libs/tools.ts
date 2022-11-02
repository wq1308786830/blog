/**
 * 展示loading
 * @param isShow 是否展示
 * @param afterClose 关闭后的执行函数
 * @param content loading下的文案
 */
export function loading(isShow = true, content = '正在加载...', afterClose: Function = () => {}) {
  if (typeof window === 'object') {
    if (isShow) {
      // message.loading(content, 0, afterClose);
    } else {
      // message.destroy();
      // eslint-disable-next-line no-lonely-if
      if (typeof afterClose === 'function') {
        afterClose();
      }
    }
  } else {
    // console.log(content);
  }
}

/**
 * 展示toast
 * @param afterClose 关闭后的执行函数
 * @param content toast文案
 */
export function toast(content: any, afterClose = () => {}) {
  if (typeof window === 'object') {
    // message.info(content, 2, afterClose);
    if (typeof afterClose === 'function') {
      afterClose();
    }
  } else {
    console.log(content);
  }
}

/**
 * 将请求参数转换为application/x-www-form-urlencoded的参数形式
 * @param {Object} obj 请求参数
 * @return {string}
 */
export function parseObj2SearchParams(obj: any) {
  let searchParams = '';
  if (obj !== null && obj !== undefined) {
    searchParams = Object.keys(obj)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
      .join('&');
  }

  return searchParams;
}
