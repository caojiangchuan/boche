import request from '../utils/request';
import { stringify } from 'qs';
export async function queryWechatText(params) {
  return request(`/mmb/message/text?${stringify(params)}`);
}
//图文消息
export async function addWechatText(params) {
  return request('/mmb/message/text', {
    method: 'POST',
    body: params,
  });
}
export async function updateWechatText(params) {
  return request('/mmb/message/text', {
    method: 'PUT',
    body: params,
  });
}

export async function deleteWechatText(params) {
  return request(`/mmb/message/text/${params.id}`, {
    method: 'DELETE',
    body: {}
  })
}
