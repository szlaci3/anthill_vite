import myRequest from '@/utils/myRequest';

export async function viewCont(params) {
  return myRequest('/Employee/viewCont', {...params}, false, 'POST', true, rootUrl);
}

export async function addField(params) {
  return myRequest('/Employee/addField', {...params}, false, 'POST', true, rootUrl);
}

export async function taxDeduct(params) {
  return myRequest('/Employee/upload', {...params}, false, 'GET', true, taxDeductUrl);
}

export async function getStaffInfo(params) {
  return myRequest('/Employee/getStaffInfo', {...params}, false, 'GET');
}

export async function getTableField(params) {
  return myRequest('/Employee/getTableField', {...params}, false, 'GET');
}

export async function getTabsInfo(params) {
  return myRequest(
    `/Employee/editRow/${params.id}`,
    undefined,
    false,
    'GET',
    true,
    rootUrl);
}

export async function getDeductionInfo(params) {
  return myRequest('/Employee/staffInfo', {...params}, false, 'GET', true, taxDeductUrl);
}

export async function saveStaffInfo(params) {
  return myRequest('/Employee/saveStaffInfo', {...params}, false, 'POST', true, extendUrl, 'json');
}


