import request from '../utils/request';
import { stringify } from 'qs';

export async function query(params) {
  return request(`/mgmt/mmb/notices?${stringify(params)}`);
}
//
export async function add(params) {
  console.log(params);
  return request('/mgmt/mmb/notices', {
    method: 'POST',
    body: params,
  });
}
