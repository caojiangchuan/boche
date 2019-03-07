import request from '../utils/request';
import { stringify } from 'qs';

export async function query(params) {
    if (!params) {
        params = {}
    }
    params.role = 'user'
    return request(`/mmb/users?${stringify(params)}`);
}

export async function queryCurrent() {
    return request('/mmb/account');
}
export async function modifyPassword(params){
  return request('/mgmt/user/pwd/cur', {
    method: 'PUT',
    body: params,
  });
}

export async function getUserDetail(id){
    return request(`mmb/users/${id}`)
}
