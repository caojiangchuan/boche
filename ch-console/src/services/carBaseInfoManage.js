import Common from '../common/Common';
import request from '../utils/request';

const Utils = new Common();

// 车辆管理 基本信息查询
export async function carBaseInfoManageQuery(params) {
  params.searchType = 'lk';
  if(Utils.isNotNull(params.dateList)){
    params.startDate = 'createdate';
    params.endDate = 'createdate';
  }
  let url = Utils.forSearch(params)
  return request(`/mgmt/cars?${url}`);
}

// 车辆管理 基本信息--新增
export async function carBaseInfoManageAdd(params) {
  return request('/mgmt/cars', {
    method: 'POST',
    body: params,
  });
}

// 车辆管理 基本信息--修改
export async function carBaseInfoManageUpdate(params) {
  const key = params.id;
  return request('/mgmt/cars/' + key, {
    method: 'PUT',
    body: params,
  });
}

// 车辆管理 基本信息--删除
export async function carBaseInfoManageRemove(params) {
  return request('/mgmt/cars/' + params, {
    method: 'DELETE',
  });
}
