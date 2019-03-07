import request from '../utils/request';
import Common from '../common/Common';

const Utils = new Common();

//运营管理 设备报修查询
export async function deviceRepairQuery(params) {
  params.searchType='lk';
  let body = Utils.forSearch(params);
  let url = body;
  if(Utils.isNotNull(params.status)){
    url =  body.replace('status lk','status eq');
  }
  return request(`/mgmt/devicemaintian?${url}`);
}

//运营管理 设备报修新增修改
export async function deviceRepairUpdate(params) {
  const key = params.id;
  return request('/mgmt/devicemaintian/' + key, {
    method: 'PUT',
    body: params,
  });
}

//运营管理 设备报修-发送报修短信
export async function deviceRepairMessage(params) {
  return request(`/mgmt/devicemaintian/${params.id}/msg`);
}
