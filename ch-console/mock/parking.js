import { parse } from 'url';

// 停车管理
// mock tableListDataSource
// 欠费催缴数据
let tableListDataSource = [];
for (let i = 1; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    orderSerialNumber: `park0000${i}`,
    userName: '欧阳',
    totalAmount: i * 2,
    receivableAmount: i + 1,
    rechargeAmount: i * 2 - 1,
    cashier: '巡检员',
    payStatus: '未支付',
    desc: '这是缴费的备注----',
    createdDate: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
  });
}

// 停车订单数据
let parkingOrderDataSource = [];
for (let i = 1; i < 58; i += 1) {
  parkingOrderDataSource.push({
    key: i,
    orderNumber: `parkOrder0000${i}`,
    dateTime: new Date(),
    amount: '￥2',
    orderVerify: '待确认',
    orderStatus: i % 3 === 0 ? '订单生成' : '订单完整',
    payStatus: i % 3 === 0 ? '未支付' : '支付成功',
    orderName: '公共泊车停车费',
    berthCode: `${i}号`,
    videoPileCode: `${i}号`,
    area: '3-1片区',
    licensePlateNumber: '沪AXXXXX',
    parkingTime: new Date(),
    leaveTime: new Date(),
  });
}

// 停车告警数据
let parkingAlarmDataSource = [];
for (let i = 1; i < 58; i += 1) {
  parkingAlarmDataSource.push({
    key: i,
    serialNumber: `parkAlarm0000${i}`,
    batchNumber: `alarmBatch0000${i}`,
    alarmType: 'CPU',
    alarmNumber: '警告',
    alarmGrade: '中级警告',
    alarmTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    equipmentType: '视屏桩',
    other1: '其他项1',
    other2: '其他项2',
    other3: '其他项3',
  });
}

// 在线订单数据 parkingOnlinePaymentDataResource
let parkingOnlinePaymentDataResource = [];
for (let i = 1; i < 58; i += 1) {
  parkingOnlinePaymentDataResource.push({
    key: i,
    payNumber: i % 2 === 0 ? `wxpa000000${i}` : `alip000000${i}`,
    paymentInitiationTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    amount: `￥12`,
    payPlatform: i % 2 === 0 ? '微信支付' : '支付宝支付',
    paymentResult: i % 3 === 0 ? '支付失败' : '支付成功',
    paymentSuccessTime: new Date(),
    orderNumber: `parkOrder0000${i}`,
    berthCode: `${i}号`,
    videoPileCode: `${i}号`,
    area: `3-${i}片区`,
    licensePlateNumber: '沪AXXXXX',
  });
}

// Parking 欠费催缴
export function getParkingArrears(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = [...tableListDataSource];

  if (params.keywords) {
    dataSource = dataSource.filter(
      data =>
        data.orderSerialNumber === params.keywords ||
        data.userName === params.keywords ||
        data.cashier === params.keywords
    );
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

/**
 * 停车订单
 */
// Parking 停车订单管理 (查询信息)
export function getParkingOrder(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = [...parkingOrderDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.keywords) {
    dataSource = dataSource.filter(
      data => data.orderNumber === params.keywords || data.orderNumber === params.keywords
    );
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

/**
 * 停车告警
 */
// Parking 停车告警 (查询信息)
export function getParkingAlarm(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = [...parkingAlarmDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.keywords) {
    dataSource = dataSource.filter(data => data.userName.indexOf(params.keywords) > -1);
  }

  if (params.keywords) {
    dataSource = dataSource.filter(data => data.orderSerialNumber.indexOf(params.keywords) > -1);
  }

  if (params.keywords) {
    dataSource = dataSource.filter(data => data.cashier.indexOf(params.keywords) > -1);
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

/**
 * 在线订单管理
 */
// Parking 在线订单管理 (查询信息)parkingOnlinePaymentQuery
export function parkingOnlinePaymentQuery(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = [...parkingOnlinePaymentDataResource];

  if (params.keywords) {
    dataSource = dataSource.filter(
      data =>
        data.payNumber === params.keywords ||
        data.amount === '￥' + params.keywords ||
        data.berthCode === params.keywords
    );
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

// Parking 在线订单管理 (修改、删除、添加信息)
export function postParkingOnlinePayment(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, key, formItem } = body;
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      parkingOnlinePaymentDataResource = parkingOnlinePaymentDataResource.filter(
        item => (key + '').indexOf(item.key) === -1
      );
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      formItem.key = i;
      parkingOnlinePaymentDataResource.push(formItem);
      break;
    case 'update':
      parkingOnlinePaymentDataResource = parkingOnlinePaymentDataResource.map(item => {
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
    list: parkingOnlinePaymentDataResource,
    pagination: {
      total: parkingOnlinePaymentDataResource.length,
    },
  };

  return res.json(result);
}
