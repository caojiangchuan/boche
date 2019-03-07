import request from '../utils/request';
import {stringify} from "qs";

export async function queryWeather(params) {
  return request(`/mgmt/geographic/weather?${stringify(params)}`);
}
