import { message } from 'antd';

/**
 * 展示loading
 * @param isShow 是否展示
 * @param afterClose 关闭后的执行函数
 * @param content loading下的文案
 */
function loading(isShow = true, content = '正在加载...', afterClose = undefined) {
  if (isShow) {
    message.loading(content, 0, afterClose);
  } else {
    message.destroy();
    afterClose && afterClose();
  }
}

/**
 * 展示toast
 * @param afterClose 关闭后的执行函数
 * @param content toast文案
 */
function toast(content, afterClose = undefined) {
  message.info(content, 2, afterClose);
  afterClose && afterClose();
}

/**
 * 将请求参数转换为application/x-www-form-urlencoded的参数形式
 * @param {Object} obj 请求参数
 * @return {string}
 */
function parseObj2SearchParams(obj) {
  let searchParams = '';
  if (obj !== null && obj !== undefined) {
    searchParams = Object.keys(obj)
      .map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
      })
      .join('&');
  }

  return searchParams;
}

export default { loading, toast, parseObj2SearchParams };
