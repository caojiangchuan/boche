import request from '../utils/request';
import { stringify } from 'qs';

export async function queryWechatNews(params) {
  return request(`/mmb/message/news?${stringify(params)}`);
}
//图文消息
export async function addWechatNews(params) {
  return request('/mmb/message/news', {
    method: 'POST',
    body: params,
  });
}
export async function updateWechatNews(params) {
  return request('/mmb/message/news', {
    method: 'PUT',
    body: params,
  });
}

export async function deleteWechatNews(params) {
  return request(`/mmb/message/news/${params.id}`, {
    method: 'DELETE',
    body: { }
  })
}
