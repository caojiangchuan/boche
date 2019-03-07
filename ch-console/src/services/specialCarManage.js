import { stringify } from 'qs';
import request from '../utils/request';
import Common from '../common/Common';

const Utils = new Common();



//车辆管理 特权车辆管理查询
export async function specialCarQuery(params) {
  params.searchType = 'lk';
  if(Utils.isNotNull(params.dateList)){
    params.startDate = 'startdate';
    params.endDate = 'enddate';
  }
  let url = Utils.forSearch(params)
  return request(`/mgmt/excpcars?${url}`);
}

//车辆管理 特权车辆管理新增
export async function specialCarAdd(params) {
  return request('/mgmt/excpcars', {
    method: 'POST',
    body: params,
  });
}

//车辆管理 特权车辆管理修改
export async function specialCarUpdate(params) {
  const key = params.id;
  return request('/mgmt/excpcars/' + key, {
    method: 'PUT',
    body: params,
  });
}

//车辆管理 特权车辆管理删除
export async function specialCarDel(params) {
  return request('/mgmt/excpcars/' + params, {
    method: 'DELETE',
  });
}
