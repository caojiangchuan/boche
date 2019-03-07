import request from '../utils/request';
import { stringify } from 'qs';

export async function query(params) {
  return request(`/mgmt/mmb/enterprises?${stringify(params)}`);
}

export async function add(params) {
  return request('/mgmt/mmb/enterprises', {
    method: 'POST',
    body: params,
  });
}
