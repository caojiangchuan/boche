import request from '../utils/request';
import Common from '../common/Common'
const Utils = new Common();

//系统管理 组织查询
export async function organizationQuery(params) {
  params.searchType='lk';
  return request(`/mgmt/organization?${Utils.forSearch(params)}`);
}

// 组织查询-包含部门信息
export async function organizationAndDeptQuery(params) {
  return request(`/mgmt/organization/dept?${Utils.forSearch(params)}`);
}

//系统管理 组织删除
export async function organizationDel(params) {
  return request(`/mgmt/organization/${params.id}`, {
    method: 'DELETE',
  });
}

//系统管理 组织新增修改
export async function organizationAdd(params) {
  return request('/mgmt/organization', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//系统管理 组织新增修改
export async function organizationUpdate(params) {
  return request(`/mgmt/organization/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
