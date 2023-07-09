import moment from 'moment';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

/* Mine */
export const eduOptions = ['junior high school ',' technical secondary school ',' master ',' undergraduate ',' junior college ',' higher vocational ',' technical secondary school ',' senior high school ',' other '];
export const contractTypeOptions = ['劳动合同','实习协议','劳务协议','聘用协议','兼职合同'];

export const hasVal = val => {
  if (val === null || typeof val === "undefined") {
    return false;
  }
  return true;
};

export const toArrayIfPossible = obj => {
  if (typeof obj !== "object") {
    return obj;
  }
  if (obj === null || JSON.stringify(obj) === "{}") {// Only Obj and Arr are processed further
    return [];
  }
  if (Array.isArray(obj)) {
    return obj.map(item => (item === null ? null : toArrayIfPossible(item)));
  }
  let isPossible = true;
  for (let key in obj) {
    if (isNaN(Number(key))) {
      isPossible = false;
      break;
    }
  }
  let ret = isPossible ? [] : {};
  for (let key in obj) {
    if (isPossible) {
      key = Number(key);
    }
    ret[key] = obj[key] === null ? null : toArrayIfPossible(obj[key]);
  }
  return ret;
};

export const toObject = (arr) => { // not recursive
  if (!Array.isArray(arr)) {
    return arr;
  } else {
    return arr.reduce(function(obj, cur, i) {
      obj[i] = cur; //toObject(cur);
      return obj;
    }, {});
  }
};

export const toBool = (val) => {
  switch(String(val).toLowerCase().trim()){
    case "true": case "1": return true;
    case "false": case "0": return false;
    default: return Boolean(val);
  }
};

/* undefined -> ""
 * (0.00499) -> 0
 * (0.005) -> 0.01
 * but due to toFixed rules:
 * (3.005)-> 3
 * (3.0051)-> 3.01
 * call with "floor" for rounding down
 * (3.00999, "floor")-> 3
 */
export const to0_2Dec = (val, method) => {
  if ((isNaN(val) && typeof val === "number") || !hasVal(val)) {
    return "";
  }
  if (isNaN(Number(val)) || (typeof val === "string" && val.trim() === "")) {
    return val;
  }
  if (method === "floor") {
    return String(Math.floor(val * 100) / 100);
  }
  return String(Number(Number(val).toFixed(2)));
}

/* "anyString" returns "anyString"
 * .5 returns "50%"
 * if "%" is not wanted, use (100 * window.toTwoDec(val)) . That will display "anyString [%]" if string.
 */
export const toPercent = (val) => {
  if ((isNaN(val) && typeof val === "number") || val === null) {
    return "";
  }
  if (isNaN(Number(val)) || (typeof val === "string" && val.trim() === "")) {
    return val;
  }
  return (100 * val).toFixed(2) + "%";
}

export const toPercent0_4Dec = (val) => {
  // possible outputs: 9 0.1 0.22 0.333 0.4444
  if ((isNaN(val) && typeof val === "number") || val === null) {
    return "";
  }
  if (isNaN(Number(val)) || (typeof val === "string" && val.trim() === "")) {
    return val;
  }
  return String(Math.round(val * 1000000)/10000);// avoids most precision errors
}

export const toPercent2_4Dec = (val) => {
  // possible outputs: 9.00 0.10 0.22 0.333 0.4444
  if ((isNaN(val) && typeof val === "number") || val === null) {
    return "";
  }
  if (isNaN(Number(val)) || (typeof val === "string" && val.trim() === "")) {
    return val;
  }
  var ret = Math.round(val * 1000000)/10000;
  var decimals = String(ret).split(".")[1];
  if (!hasVal(decimals) || decimals.length < 2) {
    ret = ret.toFixed(2);
  }
  return String(ret);
}

export const formatDate = (date) => {//2020-04-9
  return date ? date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getDate() : "";  
}
export const formatDate0000 = (date) => {//2020-04-09
  return date ? date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) : "";  
}
export const formatTime = (date) => {
  return date ? date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) : "";
}

// export const animatedScroll = (element, parent, time) => { // for MMarketProduct tab switch
  // var parentPosition = $(parent).scrollTop() ;
  // var b = $(element)[0].offsetTop;
  // var c = $(parent)[0].offsetTop;

//   $(parent).animate({
//       scrollTop: $(element)[0].offsetTop - $(parent)[0].offsetTop,
//     }, time, "swing");
// }

export const noWhiteSpace = (str) => {// for URLs in location.search, especially chinese
  return str.split(" ").join("").split("/").join("");
}

export const avoidDoubleArrow = !!navigator.platform && !/iPad|iPhone|iPod/.test(navigator.platform) &&
      navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1; // WeChat browser running on non-iOS

export const toMoment = (sec: number) => {
  if (!sec) {
    return null;
  }
  return moment.unix(sec);
}

export const delay = (ms) => (
  new Promise(resolve => setTimeout(resolve, ms))
)

