import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    id: i,
    carNo: `沪A0000${i}`,
    frameNo: `车架号${i}`,
    carModel: 'SUV',
    colour: `白色`,
    brandModel: `帕拉梅拉 ${i}`,
    panoramaPic: `全景图${i}`,
    owner: '浦东',
    idCard: `3100234...`,
    tel: '1308306...',
    createdBy: `浦东交警${i}`,
    createdDate: new Date(),
    lastModifiedBy: `协警${i}`,
    lastModifiedDate: new Date(),
  });
}

export function getRule(req, res, u) {
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

  if (params.carNo) {
    dataSource = dataSource.filter(data => data.carNo.indexOf(params.carNo) > -1);
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

export function postRule(req, res, u, b) {
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
        carNo: `沪A0000${i}`,
        frameNo: `车架号${i}`,
        carModel: 'SUV',
        colour: `白色`,
        brandModel: `帕拉梅拉 ${i}`,
        panoramaPic: `全景图${i}`,
        owner: '浦东',
        idCard: `3100234...`,
        tel: '1308306...',
        createdBy: `浦东交警${i}`,
        createdDate: new Date(),
        lastModifiedBy: `协警${i}`,
        lastModifiedDate: new Date(),
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
  getRule,
  postRule,
};
