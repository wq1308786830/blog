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

export default { parseObj2SearchParams };
