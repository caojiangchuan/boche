import Common from '../common/Common';
import request from '../utils/request';

const Utils = new Common();

//车辆管理 违章信息查询
export async function disobeyInfoManageQuery(params) {
  params.searchType = 'lk';
  if(Utils.isNotNull(params.dateList)){
    params.startDate = 'startdate';
    params.endDate = 'enddate';
  }
  return request(`/mgmt/carillegalpark?filter=${Utils.forSearch(params)}`);
}
//车辆管理 违章信息删除
export async function disobeyInfoManageDel(params) {
  return request('/mgmt/carillegalpark', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
//车辆管理 违章信息新增修改
export async function disobeyInfoManageAdd(params) {
  return request('/mgmt/carillegalpark', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
