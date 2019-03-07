import { isUrl } from '../utils/utils';
import Common from '../common/Common';

const Utils = new Common();

// 菜单信息
const menuData = [
  {
    name: '首页',
    icon: 'home',
    path: 'home',
  },
  {
    name: '资源管理',
    icon: 'table',
    path: 'resource',
    children: [
      {
        name: '停车场管理',
        path: 'parkingManage',
      },
      {
        name: '设备资产管理',
        path: 'deviceAsset',
      },
      {
        name: '设备运营管理',
        path: 'deviceAssetMap',
      },
    ],
  },
  {
    name: '车辆管理',
    icon: 'car',
    path: 'carManage',
    children: [
      {
        name: '基本信息管理',
        path: 'infoManage',
      },
      {
        name: '特权车辆管理',
        path: 'specialCarManage',
      },
      {
        name: '违停信息管理',
        path: 'disobeyInfoManage',
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'team',
    path: 'members',
    children: [
      {
        name: '会员管理',
        path: 'member',
      },
    ],
  },
  {
    name: '人员管理',
    icon: 'user',
    path: 'staff',
    children: [
      {
        name: '运营人员管理',
        path: 'operational',
      },
      // {
      //   name: '排班管理',
      //   path: '2',
      // },
      // {
      //   name: '请假管理',
      //   path: 'leave',
      // },
      {
        name: '现金充值',
        path: 'cash',
      },
    ],
  },
  {
    name: '结算管理',
    icon: 'api',
    path: 'settlement',
    children: [
      {
        name: '停车计费策略',
        path: 'settlementMethod',
      }
    ],
  },
  {
    name: '停车管理',
    icon: 'car',
    path: 'parking',
    children: [
      {
        name: '停车资料确认',
        path: 'parkingDataConfirm',
      },
      // {
      //   name: '停车警告管理',
      //   path: 'parkingAlarm',
      // },
      {
        name: '停车订单管理',
        path: 'parkingOrder',
      },
      {
        name: '欠费催缴',
        path: 'parkingArrears',
      },
      {
        name: '在线支付管理',
        path: 'parkingOnlinePayment',
      },
    ],
  },
  {
    name: '运行管理',
    icon: 'tool',
    path: 'run',
    children: [
      // {
      //   name: '版本管理',
      //   path: 'versionManage',
      // },
      {
        name: '设备报修',
        path: 'deviceRepair',
      },
    ],
  },
  {
    name: '系统设置',
    icon: 'check-circle-o',
    path: 'system',
    children: [
      {
        name: '组织管理',
        path: 'organizationManage',
      },
      {
        name: '部门管理',
        path: 'deptManage',
      },
      {
        name: '角色管理',
        path: 'roleManage',
      },
      {
        name: '员工管理',
        path: 'staffManage',
      },
      // {
      //   name: '缓存管理',
      //   path: 'cacheManage',
      // },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];
function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

const menuList = JSON.parse(sessionStorage.getItem("functionList"));

let functionList;

if (Utils.isNotNull(menuList)) {
  functionList = menuList;
} else {
  functionList = [];
}

export const getMenuData = () => formatter(functionList);
