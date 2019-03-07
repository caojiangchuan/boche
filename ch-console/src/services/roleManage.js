import request from '../utils/request';
import Common from '../common/Common'

const Utils = new Common();

//系统管理 角色查询管理-查询所有角色信息
export async function roleManageQuery(params) {
  params.searchType='lk';
  return request(`/mgmt/role?${Utils.forSearch(params)}`);
}

//系统管理 角色查询管理-查询某角色详细信息
export async function roleManageQueryDetail(params) {
  return request(`/mgmt/role/` + params);
}

//系统管理 角色新增管理
export async function roleManageAdd(params) {

  console.log(params, 'params');

  return request('/mgmt/role', {
    method: 'POST',
    body: params,
  });
}

//系统管理 角色修改管理
export async function roleManageUpdate(params) {

  console.log(params, 'params');

  const key = params.id;
  console.log(key);
  return request('/mgmt/role/' + key, {
    method: 'PUT',
    body: params,
  });
}

//系统管理 角色删除管理
export async function roleManageDel(params) {
  return request('/mgmt/role/' + params, {
    method: 'DELETE',
  });
}
