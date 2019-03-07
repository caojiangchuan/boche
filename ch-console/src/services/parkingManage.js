import { stringify } from 'qs';
import request from '../utils/request';
import Common from '../common/Common'

const Utils = new Common();
//资源管理 停车场列表

export async function parkingManageQuery(params) {
  params.searchType='lk';
  return request(`/mgmt/park?${Utils.forSearch(params)}`)
}

//新增停车场
export async function parkingAdd(params) {
  return request('/mgmt/park', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//修改停车场
export async function parkingUpdate(params) {
  return request(`/mgmt/park/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

//删除泊位
export async function parkingDel(params) {
  return request(`/mgmt/park/${params.id}`, {
    method: 'DELETE',
  });
}

//获取泊位信息
export async function getCarFieldList(params) {
  const filter = `${Utils.isNotNull(params.key)?`&filter=key lk ${params.key}`:''}`;
  return request(`/mgmt/park/position/${params.id}?start=${params.page.start}&limit=${params.page.limit}${filter}`)
}

//根据区域获取泊位信息
export async function getCarFieldListByArea(params) {
  const filter = `${Utils.isNotNull(params.key)?`&filter=key lk ${params.key}`:''}`;
  return request(`/mgmt/parkarea/position/${params.id}?start=${params.page.start}&limit=${params.page.limit}${filter}`)
}




//修改泊位
export async function parkFieldUpdate(params) {
  return request(`/mgmt/parkposition/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

//修改泊位状态
export async function parkPositionStatusUpdate(params) {
  return request(`/mgmt/parkposition/status/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

//删除泊位
export async function parkFieldDel(params) {
  return request(`/mgmt/parkposition/${params.id}`, {
    method: 'DELETE',
  });
}

//新增泊位
export async function parkingFieldAdd(params) {
  return request('/mgmt/parkposition', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//新增片区
  export async function  addArea(params) {
    return request('/mgmt/parkarea', {
      method: 'POST',
      body: {
        ...params,
        method: 'post',
      },
    });
  }

//修改片区
export async function updateArea(params) {
  return request(`/mgmt/parkarea/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

//修改片区
export async function delArea(params) {
  return request(`/mgmt/parkarea/${params.id}`, {
    method: 'DELETE',
  });
}


//获取停车场列表
export async function getParkList() {
  return request(`/mgmt/park/notnest`)
}

// 通过停车场获取泊位使用信息
export async function getParkPositionStatusCount(param) {
  return request(`/mgmt/parkposition/statuscount/${param.id}/park`)
}

// 通过停车场获取泊位使用信息
export async function getAreaPositionStatusCount(param) {
  return request(`/mgmt/parkposition/statuscount/${param.id}/area`)
}
