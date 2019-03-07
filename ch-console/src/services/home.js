import request from '../utils/request';
import {stringify} from "qs";

// 停车次数： 即停车次数统计，单位是日
export async function parkinghis() {
  return request(`/mgmt/parkinghis/day`);
}

// 停车次数： 即停车次数统计，最近7天
export async function parkinghisByWeek() {
  return request(`/mgmt/parkinghis/count/7`);
}

// 新增用户：即新注册用户数量，单位是日
export async function queryCustomersCountByDay() {
  return request(`/mgmt/customers/daycount`);
}

// 新增用户：即新注册用户数量，最近7天
export async function queryCustomersCountByWeek() {
  return request(`/mgmt/customers/count/7`);
}

// 新增设备：即新增设备数量，最近7天
export async function queryDevicesCountByWeek() {
  return request(`/mgmt/devices/count/7`);
}

// 违停数：即离开车辆未支付数量，单位是周
export async function queryCarIllegalParkByWeek() {
  return request(`/mgmt/carillegalpark/lastweekcount`);
}

// 收入统计-当日
export async function queryIncomingSummaryByDay() {
  return request(`/mgmt/incoming/today`);
}

// 公告信息列表
export async function queryNoticesByWeek() {
  return request(`/mgmt/notices`);
}

// 收入排行信息
export async function queryIncomingRaningByWeek() {
  return request(`/mgmt/incoming/raning`);
}

// 收入统计-最近7天
export async function queryIncomingSummaryByWeek() {
  return request(`/mgmt/incoming/summary`);
}



