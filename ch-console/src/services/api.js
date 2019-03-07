import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

// 人员管理-现金充值
export async function queryCash(params) {
  return request(`/api/staff/cash?${stringify(params)}`);
}

//车辆管理 基本信息查询
export async function queryRule(params) {
  return request(`/api/carManage?${stringify(params)}`);
}
//车辆管理 基本信息删除
export async function removeRule(params) {
  return request('/api/carManage', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
//车辆管理 基本信息新增修改
export async function addOrUpdate(params) {
  return request('/api/carManage', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

//车辆管理 违章信息查询
export async function disobeyInfoManageQuery(params) {
  return request(`/carillegalpark?${stringify(params)}`);
}
//车辆管理 违章信息删除
export async function disobeyInfoManageDel(params) {
  return request('/carillegalpark', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
//车辆管理 违章信息新增修改
export async function disobeyInfoManageAdd(params) {
  return request('/carillegalpark', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

//车辆管理 特权车辆管理查询
export async function specialCarQuery(params) {
  return request(`/api/specialCarManage?${stringify(params)}`);
}
//车辆管理 特权车辆管理删除
export async function specialCarDel(params) {
  return request('/api/specialCarManage', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
//车辆管理 特权车辆管理新增修改
export async function specialCarAdd(params) {
  return request('/api/specialCarManage', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

//运营管理 设备报修查询
export async function deviceRepairQuery(params) {
  return request(`/api/deviceRepair?${stringify(params)}`);
}
//运营管理 设备报修删
export async function deviceRepairDel(params) {
  return request('/api/deviceRepair', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
//运营管理 设备报修新增修改
export async function deviceRepairAdd(params) {
  return request('/api/deviceRepair', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}



//系统管理 缓存管理
export async function cacheManageQuery(params) {
  return request(`/api/cacheManage?${stringify(params)}`);
}


//系统管理 员工查询管理
export async function staffManageQuery(params) {
  return request(`/api/staffManage?${stringify(params)}`);
}

export async function getStaff(params) {
  return request(`/api/getStaff?${stringify(params)}`)
}
//系统管理 员工删除管理
export async function staffManageDel(params) {
  return request('/api/staffManage', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
//系统管理 员工新增管理
export async function staffManageAdd(params) {
  return request('/api/staffManage', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

//系统管理 角色查询管理
export async function roleManageQuery(params) {
  return request(`/role${stringify(params)}`);
}
//系统管理 角色删除管理
export async function roleManageDel(params) {
  return request('/api/roleManage', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
//系统管理 角色新增管理
export async function roleManageAdd(params) {
  return request('/api/roleManage', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
