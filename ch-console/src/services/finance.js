import request from '../utils/request';
import { stringify } from 'qs';

export async function query(params) {
  return request(`/mgmt/mmb/workRecords/dispute?${stringify(params)}`);
}
//考勤管理按月统计
export async function queryByMonth(params) {
  return request(`/mgmt/mmb/public/workrecords/statistics/month?${stringify(params)}`);
}
//考勤管理按日统计
export async function queryByDay(params) {
  return request(`/mgmt/mmb/public/workrecords/statistics/day?${stringify(params)}`);
}
export async function disputeReview(params) {
  console.log(params);
  return request('/mgmt/mmb/workRecords/dispute/review', {
    method: 'POST',
    body: params,
  });
}
