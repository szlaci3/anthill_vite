import myRequest from '@/utils/myRequest';

export async function readed(params) {
  return myRequest('/index/Article_Info/readed', {...params}, false, 'POST', false, cmsUrl);
}

