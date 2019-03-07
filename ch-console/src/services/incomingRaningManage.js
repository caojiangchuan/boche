import request from '../utils/request';
import Common from '../common/Common'

const Utils = new Common();

// 系统管理 收入排行管理-查询收入排行信息
export async function incomingRaningQuery(params) {
  params.searchType='lk';
  return request(`/mgmt/incoming/raning?${Utils.forSearch(params)}`);
}
