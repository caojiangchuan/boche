import { stringify } from 'qs';
import request from '../utils/request';
import Common from '../common/Common'

const Utils = new Common();
//根据组织id获取辖下部门
export async function getDept(params) {
  return request(`/mgmt/department?${Utils.forSearch(params)}`)
}

//系统管理 删除部门
export async function deptManageDel(params) {
  return request(`/mgmt/department/${params.id}`, {
    method: 'DELETE',
  });
}

//系统管理 部门新增
export async function deptManageAdd(params) {
  return request('/mgmt/department', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//系统管理 部门修改
export async function deptManageUpdate(params) {
  return request(`/mgmt/department/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
