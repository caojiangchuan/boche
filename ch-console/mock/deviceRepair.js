import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 21; i += 1) {
  tableListDataSource.push({
    key: i,
    id: i,
    taskNo: `20180907${i}`,
    status:`${i/2===0?0:1}`,
    repairSource:'员工报修',
    repairStaff:`巡检员${i}`,
    tel:`1230854215${i}号`,
    repairDate: new Date(),
    repairContent:`浦东交警${i}局`,
    repairPic: `图片链接${i}`,
    deviceNo: `001002${i}`,
    repairer:`保时捷4S店${i}`,
    sendDate:new Date(),
    repairResult:`修好了${i}`,
    repairCharge:'1000',
    endDate:new Date(),
  });
}

export function deviceRepairRule(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    dataSource = dataSource.filter(data => data.status.indexOf(params.status) > -1);
  }
  if (params.taskNo) {
    dataSource = dataSource.filter(data => data.taskNo.indexOf(params.taskNo) > -1);
  }
  if (params.repairContent) {
    dataSource = dataSource.filter(data => data.repairContent.indexOf(params.repairContent) > -1);
  }
  if (params.deviceNo) {
    dataSource = dataSource.filter(data => data.deviceNo.indexOf(params.deviceNo) > -1);
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

export function deviceRepairPostRule(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, no } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => no.indexOf(item.no) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        id: i,
        taskNo: `20180907${i}`,
        status:`${i/2===0?0:1}`,
        repairSource:'员工报修',
        repairStaff:`巡检员${i}`,
        tel:`1230854215${i}号`,
        repairDate: new Date(),
        repairContent:`浦东交警${i}局`,
        repairPic: `图片链接${i}`,
        deviceNo: `001002${i}`,
        repairer:`保时捷4S店${i}`,
        sendDate:new Date(),
        repairResult:`修好了${i}`,
        repairCharge:'1000',
        endDate:new Date(),
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

export default {
  deviceRepairRule,
  deviceRepairPostRule,
};
