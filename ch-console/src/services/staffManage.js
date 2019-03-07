import request from '../utils/request';
import Common from '../common/Common';

const Utils = new Common();

//系统管理 员工查询管理
export async function staffManageQuery(params) {
  return request(`/mgmt/user?${Utils.forSearch(params)}`);
}

//系统管理 根据组织查询员工信息
export async function staffManageQueryByOrg(params) {
  const orgid = params.orgid;
  delete params.orgid;
  params.searchType='lk'
  return request(`/mgmt/user/getbyorgid/${orgid}?${Utils.forSearch(params)}`);
}

//系统管理 根据部门员工信息
export async function staffManageQueryByDept(params) {
  return request(`/mgmt/user?${Utils.forSearch(params)}`);
}

//系统管理 员工新增管理
export async function staffManageAdd(params) {
  return request('/mgmt/user', {
    method: 'POST',
    body: params,
  });
}

//系统管理 员工管理-修改信息
export async function staffManageUpdate(params) {
  const key = params.id;
  return request('/mgmt/user/' + key, {
    method: 'PUT',
    body: params,
  });
}

//系统管理 员工管理-删除
export async function staffManageRemove(params) {
  return request('/mgmt/user/' + params, {
    method: 'DELETE',
  });
}

//系统管理 员工管理-开通登录
export async function staffManageUpdateLoginStatus(params) {
  const key = params.id;
  return request('/mgmt/user/enablelogin/' + key, {
    method: 'PUT',
    body: params,
  });
}

//系统管理 员工管理-重置密码
export async function staffManageUpdatePwd(params) {
  const key = params.id;
  return request('/mgmt/user/pwd/' + key, {
    method: 'PUT',
    body: params,
  });
}

//系统管理 员工管理-分配角色
export async function staffManageUpdateRole(params) {
  const key = params.id;
  return request('/mgmt/user/role/' + key, {
    method: 'PUT',
    body: params,
  });
}

//员工登录
export async function userLogin(params) {
  return request('/mgmt/user/login', {
    method: 'POST',
    body: params,
  });
}



