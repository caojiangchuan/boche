import { stringify } from 'qs';
import request from '../utils/request';
import Common from '../common/Common';

const Utils = new Common();

// 资源管理-设备资产管理(智慧桩)信息
export async function queryDevice(params) {
  let body = `start=${params.page.start}&limit=${params.page.limit}`
  let url = Utils.forSearch(params)
  body=url;
  if(Utils.isNotNull(params.deviceno)){
    body = url.replace('deviceno eq','deviceno lk');
  }

  return request(`/mgmt/devices?${body}`);
}

// 资源管理-设备资产管理(智慧桩)信息-通过组织查询
export async function queryDeviceByOrg(params) {
  const key = params.orgid;
  // return request(`/mgmt/devices/orgid/` + key);
  return request(`/mgmt/devices`);
}

// 资源管理-设备资产管理(智慧桩)信息-供地图使用
export async function queryDeviceToMap(params) {
  return request(`/mgmt/devices/position?${Utils.forSearch(params)}`);
}


// 资源管理-设备资产管理(智慧桩)--新增
export async function deviceAdd(params) {
  return request('/mgmt/devices', {
    method: 'POST',
    body: params,
  });
}
// 资源管理-设备资产管理(智慧桩)--修改
export async function deviceUpdate(params) {
  const key = params.id;
  console.log(key);
  return request('/mgmt/devices/' + key, {
    method: 'PUT',
    body: params,
  });
}
// 资源管理-设备资产管理(智慧桩)--删除
export async function deviceRemove(params) {
  return request('/mgmt/devices/' + params, {
    method: 'DELETE',
  });
}

