import myRequest from '@/utils/myRequest';

export async function contractData(params) {
  return myRequest('/Contract/data', params, false, 'POST');
}

export async function addRow(params) {
  return myRequest('/Contract/addRow', params, false, 'POST');
}

export async function addExcel(params) {
  return myRequest('/Contract/addExcel', params, false, 'POST');
}

export async function delRow(params) {
  return myRequest('/Contract/delRow', params, false, 'POST');
}

export async function sendContract(params) {
  return myRequest('/Contract/sendContract', params, false, 'POST');
}

