import request from '../utils/request';
import Common from '../common/Common'
import {stringify} from "qs";

const Utils = new Common();

//策略查询
export async function settlementQuery(params) {
  params.searchType='lk';
  return request(`/mgmt/parkstrategy?${Utils.forSearch(params)}`);
}

//时段列表查询
export async function timeListQuery(params) {
  return request(`/mgmt/parkstrategydetail/${params.id}`);
}


//策略新增
export async function addSettlement(params) {
  return request('/mgmt/parkstrategy', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//策略修改
export async function updateSettlement(params) {
  return request(`/mgmt/parkstrategy/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}


//策略删除
export async function removeSettlement(params) {
  return request(`/mgmt/parkstrategy/${params.id}`, {
    method: 'DELETE',
  });
}

//策略新增
export async function addTime(params) {
  return request('/mgmt/parkstrategydetail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//时间段删除
export async function removeTime(params) {
  return request(`/mgmt/parkstrategydetail/${params.id}`, {
    method: 'DELETE',
  });
}

//时间段修改
export async function updateTime(params) {
  return request(`/mgmt/parkstrategydetail/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

//停车场列表查询
export async function getParkingList(params) {
  return request(`/mgmt/parkstrategy/${params.id}/parkNarea`);
}







