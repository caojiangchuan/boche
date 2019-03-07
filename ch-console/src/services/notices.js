import request from '../utils/request';
import { stringify } from 'qs';

export async function query(params) {
  return request(`/mgmt/mmb/notices?${stringify(params)}`);
}
//发公告
export async function add(params) {
  if(params.Id){
    return request('/mgmt/mmb/notices', {
      method: 'PUT',
      body: params,
    });
  }else {
    return request('/mgmt/mmb/notices', {
      method: 'POST',
      body: params,
    });
  }
}
