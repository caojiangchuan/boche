import { stringify } from 'qs';
import request from '../utils/request';
import Common from '../common/Common';

const Utils = new Common();

// 资源管理-设备资产管理(智慧桩)信息
export async function versionManageQuery(params) {
  return request(`/mgmt/versioncontrol?${Utils.forSearch(params)}`);
}
