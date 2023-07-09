import myRequest from '@/utils/myRequest';


export async function getTitle(params: any | undefined): Promise<any> {
  return myRequest('/globalServices/getTitle', {...params}, false, 'POST');
}

export async function getSocialPolicyCity(): Promise<any> {
  return myRequest('/globalServices/getSocialPolicyCity', undefined, false, 'GET', true, rootUrl);
}

export async function getSocialPolicyData(params: any): Promise<any> {
  return myRequest('/globalServices/getSocialPolicyData', {...params}, false, 'POST', true, rootUrl);
}

export async function parseIdentity(params: any): Promise<any> {
  return myRequest('/globalServices/parseIdentity', {...params}, false, 'POST', true, rootUrl);
}

export async function getUploadToken(): Promise<any> {
  return myRequest('/globalServices/uploadCover', undefined, true, 'POST', true, "extendUrl");
}


