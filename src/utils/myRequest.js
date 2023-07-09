import request from 'umi-request';
import { message } from 'antd';
import { history } from 'umi';
import hash from 'hash.js';

/**
 * Requests a URL, returning a promise.
 *
 */
export default function myRequest(
  urlArg,
  body = {},
  addToken = true,
  method = 'POST',
  pipeErrorHandling = true,
  urlMain = extendUrl,
  contentType,
  /* contentType: default is null. Can be "json", "x-www-form-urlencoded".
   * If null, in case of POST, FormData is used.
   * The response of form-data APIs is readable if use FormData. - At least in DEV
   */
) {
  let url = urlMain + urlArg;
  const defaultOptions = {
    method,
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, body: body };

  if (addToken) {
    newOptions.headers = {Authorization: "Bearer " + sessionStorage.getItem('logintoken') || ''};
  }

  const makeUrlSearch = (body) => {
    let _urlSearch = '';
    Object.keys(body).map((param, i) => {
      let val = body[param];
      if (val !== null && typeof val !== "undefined") {
        _urlSearch += `${i ? '&' : ''}${param}=${body[param]}`; // i ? (Whether not 0)
      }
      return 0;
    });
    return _urlSearch;
  }

  const makeUrlEncoded = (body = {}) => {
    let _urlSearch = '';
    Object.keys(body).map((param, i) => {
      let val = body[param];
      if (val !== null && typeof val !== "undefined") {
        if (body[param].map) {
          _urlSearch += body[param].map((item, j) => `${i || j ? '&' : ''}${param}%5B%5D=${encodeURIComponent(item)}`).join("");
        } else {
          _urlSearch += `${i ? '&' : ''}${param}=${encodeURIComponent(body[param])}`; // i ? (Whether not 0)
        }
      }
      return 0;
    });
    return _urlSearch;
  }

  if (method === 'GET') {
    newOptions.method = 'GET';
    let urlSearch = makeUrlSearch(newOptions.body);
    url += `?${urlSearch}`;
    delete newOptions.body;
  } else if (!contentType) {
    let bodyFormData = new FormData();
    for (let i in body) {
      if (body[i] !== null && typeof body[i] !== "undefined") {
        bodyFormData.append(i, body[i]);
      }
    }
    newOptions.body = bodyFormData;
  }

  const fingerprint = url + JSON.stringify(newOptions.body || body);
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  if (contentType === "x-www-form-urlencoded") {
    let urlSearch = makeUrlEncoded(newOptions.body);

    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      ...newOptions.headers,
    };
    newOptions.body = urlSearch;
  } else if (!(newOptions.body instanceof FormData) && method !== 'GET') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  } else {
    newOptions.headers = {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      ...newOptions.headers,
    };
  }

  return request(url, newOptions)
    //.then(res => res.json())
    .catch(e => {
      return {code: 0, status: 0, htmlRes: 1};
    })
    .then(response => {
    //   if (response.code === -1) {
    //     if (url !== flxUrl + "/Common/logout") {
    //       sessionStorage.setItem("loginExpired", "1");
    //     }
    //     sessionStorage.removeItem("logintoken");
    //     if (location.hash !== "#/login") {
    //       sessionStorage.setItem("afterLogin", location.hash.replace("#", ""));
    //     }
    //     history.push('/login');
    //   } else 
      if (pipeErrorHandling && (response.code == 0 || response.status == 0)) {
        message.error(response.msg || response.info || (response.htmlRes ? "请求错误。" : "请求错误~"));
      }
      return response;
    })
    .catch(e => {
      const status = e.name;
      if (status === "TypeError") { // user may be offline
        message.error(`请求错误`);
      }
      return {code: 0, status: 0};
    });
}