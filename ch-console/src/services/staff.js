import { stringify } from 'qs';
import request from '../utils/request';
import Common from '../common/Common';

const Utils = new Common();

// 人员管理-运营人员管理--查询
export async function queryOperational(params) {
  params.searchType = 'lk';
  return request(`/mgmt/employee?${Utils.forSearch(params)}`);
}
// 人员管理 运营人员管理--新增
export async function operationalAdd(params) {
  return request('/mgmt/employee', {
    method: 'POST',
    body: params,
  });
}
// 人员管理 运营人员管理--修改
export async function operationalUpdate(params) {
  const key = params.id;
  return request('/mgmt/employee/' + key, {
    method: 'PUT',
    body: params,
  });
}
// 人员管理 运营人员管理--删除
export async function operationalRemove(params) {
  return request('/mgmt/employee/' + params, {
    method: 'DELETE',
  });
}

// 人员管理-现金充值-查询巡查员信息列表
export async function queryEmployeeCash(params) {
  params.searchType = 'lk';
  return request(`/mgmt/employee/cash?${Utils.forSearch(params)}`);
}

// 人员管理-现金充值--充值
export async function cashRecharge(params) {
  return request('/mgmt/cashtopuphistory ', {
    method: 'POST',
    body: params,
  });
}

// 人员管理-巡检员充值明细查询
export async function queryCashDetail(params) {
  const key = params.id;
  params.id = '';
  return request(`/mgmt/cashtopuphistory/${key}/list?${Utils.forSearch(params)}`);
}

// 人员管理-巡检员充值明细--修改金额
export async function cashUpdate(params) {
  const key = params.id;
  return request('/mgmt/cashtopuphistory/' + key, {
    method: 'PUT',
    body: params,
  });
}

// 人员管理-请假管理
export async function queryLeaveInfo(params) {
  return request(`/api/staff/leave?${stringify(params)}`);
}

