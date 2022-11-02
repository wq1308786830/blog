import fetch from 'isomorphic-unfetch';
import { loading, toast, parseObj2SearchParams } from './tools';
import { prefix } from '@/config/index';

function checkStatus(response: any) {
  if (response.status < 200 || response.status >= 300) {
    const error: any = new Error(response.statusText);
    error.response = response;
    error.errMessage = '网络错误~';
    throw error;
  } else if (response.data && response.data.message === 'GENERAL') {
    const error: any = new Error(response.statusText);
    error.response = response;
    error.errMessage = '哎呀，系统开小差啦！';
    throw error;
  }
  return response;
}

/**
 * 请求后端返回Promise
 *
 * @param  {string} url       请求api
 * @param  {object} [options] fetch需要的options配置
 * @param  {boolean} [isShowLoading] 是否展示loading
 * @return {Promise}          返回数据，Promise或者undefined
 */
async function request(url: string, options: any, isShowLoading: boolean) {
  if (isShowLoading) {
    loading(true, `请求接口:${prefix + url}\n参数:${JSON.stringify(options)}`);
  }
  let res;
  try {
    const response = await fetch(prefix + url, options);
    checkStatus(response);
    res = await response.json();
  } catch (e: any) {
    // @ts-ignore
    loading(false, undefined, () => {
      if (e.errMessage) {
        return toast(e.errMessage);
      }
      return toast('网络错误～');
    });
    throw e;
  }

  if (isShowLoading) {
    loading(false, prefix + url);
  }
  return res;
}

/**
 * 调用非login接口且失败原因是`token失效`的需要重刷token
 * @param url 请求url
 * @param result 后端返回字段`result`
 * @param message 后端返回字段`message`
 * @returns {boolean}
 */
const isNeedFreshCode = (url: string, result: any, message: any) =>
  !/login/.test(url) && result === 'fail' && message === 'token失效';

/**
 * 用户登录
 * @returns {boolean} 是否登陆成功
 */
function login() {
  try {
    localStorage.setItem('token', '1111111');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 每个请求都会携带登录的token
 * @param url 请求url
 * @param options fetch options
 * @param showLoading 是否展示loading
 * @returns {Promise<void>} 请求返回结果
 */
const requestWithLogin = async (url: string, options: any, showLoading: boolean) => {
  const token = '11111';

  let isLogin = false;
  if (token) {
    isLogin = true;
  } else {
    isLogin = await login();
  }

  const fetchOptions = {
    ...options,
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  };

  let resp;
  if (isLogin) {
    resp = await request(url, fetchOptions, showLoading);
    if (resp && isNeedFreshCode(url, resp.result, resp.message)) {
      isLogin = await login();
      if (isLogin) {
        resp = await request(url, fetchOptions, showLoading);
      } else {
        toast('登录失败');
      }
    }
  }

  return resp;
};

/**
 * fetch下method=GET，options配置必须没有body
 * @param url 请求的url
 * @param {Object} params 请求参数
 * @param showLoading 是否展示loading
 * @returns {Promise<void>} 返回结果
 * @constructor
 */
export const GET = (url: string, params: any = null, showLoading = false) => {
  let searchParams = parseObj2SearchParams(params);
  searchParams = searchParams === '' ? searchParams : `?${searchParams}`;

  const options = {
    method: 'GET',
  };

  return requestWithLogin(`${url}${searchParams}`, options, showLoading);
};

export const POST = (url: string, params: any = null, showLoading = false) => {
  const searchParams = parseObj2SearchParams(params);

  const options = {
    method: 'POST',
    body: searchParams,
  };

  return requestWithLogin(url, options, showLoading);
};

export const PUT = (url: string, params: any = null, showLoading = false) => {
  const searchParams = parseObj2SearchParams(params);

  const options = {
    method: 'PUT',
    body: searchParams,
  };

  return requestWithLogin(url, options, showLoading);
};

export const DELETE = (url: string, params: any = null, showLoading = false) => {
  const searchParams = parseObj2SearchParams(params);

  const options = {
    method: 'DELETE',
    body: searchParams,
  };
  return requestWithLogin(url, options, showLoading);
};
