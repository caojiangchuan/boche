import mockjs from 'mockjs';
import { getRule, postRule } from './mock/carManage';
import { getCashInfo, getOperationalInfo, postOperationalInfo, getLeaveInfo } from './mock/staff';
import {
  getParkingArrears,
  getParkingAlarm,
  getParkingOrder,
  parkingOnlinePaymentQuery,
  postParkingOnlinePayment,
} from './mock/parking';
import { specialCarRule, specialCarPostRule } from './mock/specialCarManage';
import { disobeyInfoRule, disobeyInfoPostRule } from './mock/disobeyInfoManage';
import { deviceRepairRule, deviceRepairPostRule } from './mock/deviceRepair';
import { organizationRule, organizationPostRule } from './mock/organizationManage';
import { deptManageRule, deptManagePostRule, getDept } from './mock/deptManage';
import { getMemberInfo } from './mock/member';
import { getWeather } from './mock/geographic'
import { staffManageRule, staffManagePostRule, getStaff } from './mock/staffManage';
import { parkingManageRule, parkingManagePostRule, getCarFieldRule } from './mock/parkingManage';
import { roleManageRule, roleManagePostRule } from './mock/roleManage';
import { cacheManageRule } from './mock/cacheManage';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
// const noProxy = process.env.NO_PROXY === 'false';
const noProxy = true;
// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],

  // 天气查询
  'GET /api/geographic/weather': getWeather,

  // 用户管理-会员管理
  'GET /api/member/member': getMemberInfo,
  // 人员管理-现金充值
  'GET /api/staff/cash': getCashInfo,
  // 人员管理-请假管理
  'GET /api/staff/leave': getLeaveInfo,
  // 人员管理-运营人员管理
  'GET /api/staff/operational': getOperationalInfo,
  'POST /api/staff/operational': postOperationalInfo,

  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  // 车辆管理
  'GET /api/carManage': getRule,
  'POST /api/carManage': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  // 特种车辆管理
  'GET /api/specialCarManage': specialCarRule,
  'POST /api/specialCarManage': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: specialCarPostRule,
  },
  // 违停信息管理
  'GET /api/disobeyInfoManage': disobeyInfoRule,
  'POST /api/disobeyInfoManage': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: disobeyInfoPostRule,
  },

  // 停车场管理
  'GET /api/parkingManage': parkingManageRule,
  'GET /api/getCarField': getCarFieldRule,
  'POST /api/parkingManage': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: parkingManagePostRule,
  },

  // 设备报修
  'GET /api/deviceRepair': deviceRepairRule,
  'POST /api/deviceRepair': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: deviceRepairPostRule,
  },
  // 组织管理
  'GET /api/organizationManage': organizationRule,
  'POST /api/organizationManage': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: organizationPostRule,
  },

  // 缓存管理
  'GET /api/cacheManage': cacheManageRule,
  // 角色管理
  'GET /api/roleManage': roleManageRule,
  'POST /api/roleManage': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: roleManagePostRule,
  },

  // 部门管理
  'GET /api/deptManage': deptManageRule,
  'GET /api/getDept': getDept,
  'POST /api/deptManage': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: deptManagePostRule,
  },

  // 员工管理
  'GET /api/staffManage': staffManageRule,
  'GET /api/getStaff': getStaff,
  'POST /api/staffManage': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: staffManagePostRule,
  },

  // 停车管理-停车告警
  'GET /api/parking/parkingAlarm': getParkingAlarm,
  // 停车管理-停车订单管理 parkingOrder (查询订单信息)
  'GET /api/parking/parkingOrder': getParkingOrder,
  // 停车管理-欠费催缴
  'GET /api/parking/parkingArrears': getParkingArrears,
  // 停车管理-在线支付管理
  'GET /api/parking/parkingOnlinePayment': parkingOnlinePaymentQuery,
  'POST /api/parking/parkingOnlinePayment': postParkingOnlinePayment,

  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;

    if (password === '888888' && userName === 'admin') {
      console.log(111);
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};

export default (noProxy ? {} : delay(proxy, 1000));
