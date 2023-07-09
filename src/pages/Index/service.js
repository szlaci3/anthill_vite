import myRequest from '@/utils/myRequest';

export async function customerIndex(params) {
  return myRequest('/Index/customerIndex', params, false, 'GET', true, rootUrl);
}

export async function mawStaff(params) {
  return myRequest('/Index/mawStaff', params, false, 'GET', true, rootUrl);
}

export async function joinOutStaff(params) {
  return myRequest('/Index/joinOutStaff', params, false, 'GET', true, rootUrl);
}

export async function sbxzCostChange(params) {
  return myRequest('/Index/sbxzCostChange', params, false, 'GET', true, rootUrl);
}

export async function companyStaffInfo(params) {
  return myRequest('/Index/companyStaffInfo', params, false, 'GET', true, rootUrl);
}

export async function getStatistics(params) {
  return myRequest('/Index/getStatistics', params, false, 'GET');
}



