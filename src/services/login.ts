import myRequest from '@/utils/myRequest';


export async function login(params: any) {
  return myRequest('/auth/login', params, false, 'POST', true, rootUrl);
}

export async function logout() {
  return myRequest('/auth/logout', undefined, false, 'POST', true, rootUrl);
}

export async function getLogininfo() {
  return myRequest('/auth/getLogininfo', undefined, false, 'POST', true, rootUrl);
}

export async function getCompanyinfo() {
  return myRequest('/auth/getCompanyinfo', undefined, false, 'GET', true, rootUrl);
}

export async function authenticationGetInfo() {
  return myRequest('/auth/authenticationGetInfo', undefined, false, 'GET');
}

