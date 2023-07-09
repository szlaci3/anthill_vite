import request from 'umi-request';

const SERVERIP = 'http://localhost:3000/';

export async function mock_getError(params) {
  return request.get(`${SERVERIP}fake-error`, {params});
}

export async function mock_customerIndex(params) {
  return request.get(`${SERVERIP}customerIndex`, {params});
}

export async function mock_mawStaff(params) {
  return request.get(`${SERVERIP}mawStaff`, {params});
}

export async function mock_joinOutStaff(params) {
  return request.get(`${SERVERIP}joinOutStaff`, {params});
}

export async function mock_sbxzCostChange(params) {
  return request.get(`${SERVERIP}sbxzCostChange`, {params});
}

export async function mock_companyStaffInfo(params) {
  return request.get(`${SERVERIP}companyStaffInfo`, {params});
}

export async function mock_getStatistics(params) {
  return request.get(`${SERVERIP}getStatistics`, {params});
}



