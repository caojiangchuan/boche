import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 21; i += 1) {
  tableListDataSource.push({
    key: i,
    id: i,
    orgName: `运营公司${i}`,
    area:`上海市浦东新区${i}`,
    nature:'平台方',
    tel:`1230854215${i}号`,
    address:`上海市浦东新区浦东南路${i}号`,
    homePage: `www.baidu${i}.com`,
    introduce:`浦东智能停车${i}真好使`,
  });
}

export function organizationRule(req, res, u) {
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
  if (params.orgName) {
    dataSource = dataSource.filter(data => data.orgName.indexOf(params.orgName) > -1);
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

export function organizationPostRule(req, res, u, b) {
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
        orgName: `运营公司${i}`,
        area:`上海市浦东新区${i}`,
        nature:'平台方',
        tel:`1230854215${i}号`,
        address:`上海市浦东新区浦东南路${i}号`,
        homePage: `www.baidu${i}.com`,
        introduce:`浦东智能停车${i}真好使`,
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
  organizationRule,
  organizationPostRule,
};
