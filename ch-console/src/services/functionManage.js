import request from '../utils/request';
import Common from '../common/Common'

const Utils = new Common();

//系统管理 功能列表获取
export async function functionManageQuery(params) {
  return request(`/mgmt/function`);
}
