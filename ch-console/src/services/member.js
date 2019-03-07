import { stringify } from 'qs';
import request from '../utils/request';
import Common from '../common/Common';
import {carBaseInfoManageQuery} from "./carBaseInfoManage";

const Utils = new Common();

//用户管理-会员管理
export async function queryMember(params) {
  params.searchType = 'lk';
  return request(`/mgmt/customers?${Utils.forSearch(params)}`);
}

//用户管理-查询某个人的信息
export async function queryMemberDetail(params) {
  return request(`/mgmt/customers/` + params);
}

//用户管理-查询某个人的车辆信息
export async function carInfoByCustomerQuery(params) {
  return request(`/mgmt/carsbycustomer?${Utils.forSearch(params)}`);
}
