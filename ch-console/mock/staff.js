import { parse } from 'url';

// mock tableListDataSource

// 现金充值数据
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    phoneNumber: `131 ${i}`,
    name: `人员姓名 ${i}`,
    address: '上海市xxx区xxx街道',
    operationTime: new Date().toLocaleTimeString(),
    operationUser: '管理员',
    rechargeAmount: `￥ ${Math.floor(Math.random() * 10) % 4}`,
    paidAmount: `￥ ${Math.floor(Math.random() * 10) % 4}`,
    desc: '这是备注',
  });
}

export function getCashInfo(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.phoneNumber) {
    dataSource = dataSource.filter(data => data.phoneNumber.indexOf(params.phoneNumber) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function postStaffInfo(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, phoneNumber } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(
        item => phoneNumber.indexOf(item.phoneNumber) === -1
      );
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        phoneNumber: `131 ${i}`,
        name: `人员姓名 ${i}`,
        address: '上海市xxx区xxx街道',
        operationTime: new Date().toLocaleTimeString(),
        operationUser: '管理员',
        rechargeAmount: `￥ ${Math.floor(Math.random() * 10) % 4}`,
        paidAmount: `￥ ${Math.floor(Math.random() * 10) % 4}`,
        desc: '这是备注',
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


// 运营人员管理模块数据
let operationalDataSource = [];
for (let i = 1; i < 46; i += 1) {
  operationalDataSource.push({
    key: i,
    name: `张三 ${i}`,
    img: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    sex: `${i % 2 === 0 ? '男' : '女'}`,
    position: '组长',
    status: '正式员工',
    phoneNumber: `0851${i}`,
    address: '上海浦东',
    type: '巡检员（收费员）',
    other: 'other',
  });
}

export function getOperationalInfo(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...operationalDataSource];


  if (params.keywords) {
    dataSource = dataSource.filter(data => data.name===params.keywords || data.phoneNumber===params.keywords);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function postOperationalInfo(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, key, formItem } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      operationalDataSource = operationalDataSource.filter(
        item => ('' + key).indexOf(item.key) === -1
      );
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      formItem.key = i;
      operationalDataSource.push(formItem);
      break;
    case 'update':
      operationalDataSource = operationalDataSource.map(item => {
        if (item.key === formItem.key) {
          Object.assign(item, formItem);
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: operationalDataSource,
    pagination: {
      total: operationalDataSource.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

// 请假管理模块数据
let leaveDataSource = [];
for (let i = 1; i < 46; i += 1) {
  leaveDataSource.push({
    key: i,
    leavePeople: `张三 ${i}`,
    startTime: new Date().toLocaleTimeString(),
    endTime:  new Date().toLocaleTimeString(),
    leaveTime: '一天',
    leaveType: `${i % 3 === 0 ? '事假' : '病假'}`,
    approvePeople: '管理员',
    approveTime: new Date().toLocaleTimeString(),
    result: '同意',
    substitute: '李四',
  });
}

export function getLeaveInfo(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...leaveDataSource];


  if (params.keywords) {
    dataSource = dataSource.filter(data => data.name===params.keywords || data.phoneNumber===params.keywords);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

