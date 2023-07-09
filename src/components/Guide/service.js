import myRequest from '@/utils/myRequest';

export async function showGuide(params) {
  return myRequest('/Guide/showGuide', {...params}, false, 'GET', false, rootUrl);
}

