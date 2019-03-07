import { stringify } from 'qs';
import request from '../utils/request';
import Common from "../common/Common";

const Utils = new Common();

/*
  停车管理
 */
// 停车管理 停车告警

export async function parkingAlarmQuery(params) {
  return request(`/mgmt/carwarn?${Utils.forSearch(params)}`);
}
// 停车管理-停车订单管理queryParkingOrder
export async function queryParkingOrder(params) {
  return request(`/mgmt/orders?${Utils.forSearch(params)}`);
}
// 停车管理-停车订单管理queryParkingOrderDetail-查询订单详情
export async function queryParkingOrderDetail(params) {
  return request(`/mgmt/orders/${params}/payments`);
}
// 停车管理 欠费催缴
export async function parkingArrearsQuery(params) {
  const page = params.page;
  delete params.page;
  return request('/mgmt/unpayorders' + page, {
    method: 'POST',
    body: params,
  });
}
// 停车管理 欠费催缴-短信发送
export async function parkingArrearsSend(params) {
  const orderNo = params.orderNo;
  return request(`/mgmt/customers/${orderNo}/msg`);
}
// 停车管理 在线订单管理--查询
export async function parkingOnlinePaymentQuery(params) {
  params.searchType='lk';
  return request(`/mgmt/payments?${Utils.forSearch(params)}`);
}
// 停车管理 在线订单管理--删除
export async function parkingOnlinePaymentRemove(params) {
  return request('/api/parking/parkingOnlinePayment', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
// 停车管理 在线订单管理--添加
export async function parkingOnlinePaymentAdd(params) {
  return request('/api/parking/parkingOnlinePayment', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
// 停车管理 在线订单管理--修改
export async function parkingOnlinePaymentUpdate(params) {
  return request('/api/parking/parkingOnlinePayment', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

// 停车管理 停车资料确认--查询
export async function parkingDataConfirmQuery(params) {
  let body = `start=${params.page.start}&limit=${params.page.limit}`
  if(Utils.isNotNull(params.dateList)){
    params.startDate = 'starttime';
    params.endDate = 'endtime';
  }
  let url = Utils.forSearch(params)
  body = url;
  if(Utils.isNotNull(params.parkpositionid)){
    body = url.replace('key eq','key lk');
  }
  return request(`/mgmt/parkinghis?${body}`);
}

// 停车管理 停车资料确认--修改
export async function parkingDataConfirmUpdate(params) {
  const key = params.id;
  return request('/mgmt/parkinghis/' + key, {
    method: 'PUT',
    body: params,
  });
}

