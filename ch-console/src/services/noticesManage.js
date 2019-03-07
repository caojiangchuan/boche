import request from '../utils/request';
import Common from '../common/Common'

const Utils = new Common();

// 系统管理 公告管理-查询公告信息
export async function noticesManageQuery(params) {
  params.searchType='lk';
  return request(`/mgmt/notices?${Utils.forSearch(params)}`);
}

// 系统管理 公告管理-新增公告
export async function noticesManageAdd(params) {
  return request('/mgmt/notices', {
    method: 'POST',
    body: params,
  });
}

// 系统管理 公告管理-修改公告
export async function noticesManageUpdate(params) {
  const key = params.id;
  console.log(key);
  return request('/mgmt/notices/' + key, {
    method: 'PUT',
    body: params,
  });
}

// 系统管理 公告管理-删除公告
export async function noticesManageDel(params) {
  return request('/mgmt/notices/' + params, {
    method: 'DELETE',
  });
}
