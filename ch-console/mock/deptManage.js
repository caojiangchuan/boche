import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 21; i += 1) {
  tableListDataSource.push({
    key: i,
    id: i,
    deptName: `部门名称${i}`,
    describe:`职责描述${i}`,
    remark:'这是一个备注',
    children:[{
      key:`${i}${i}`,
      id: i,
      deptName: `二级部门名称${i}`,
      describe:`职责${i}`,
      remark:'二级备注',
      children:[{
        key:`${i}${i}${i}`,
        id: i,
        deptName: `三级部门名称${i}`,
        describe:`职责${i}`,
        remark:'三级备注',
      }]
    }]
  });
}

export function deptManageRule(req, res, u) {
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

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: [],
    deptList:[{id:1,deptName: `部门名称1`,},{id:2,deptName: `部门名称2`,}],
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

export function getDept(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = [];

  if (params.id === '1') {
    dataSource = [{
      key: 1,
      id: 1,
      deptName: `部门名称1`,
      describe:`职责描述1`,
      remark:'这是一个备注',
      children:[{
        key:`11`,
        id: 1,
        deptName: `二级部门名称1`,
        describe:`职责1`,
        remark:'二级备注',
        children:[{
          key:`111`,
          id: 1,
          deptName: `三级部门名称1`,
          describe:`职责1`,
          remark:'三级备注',
        }]
      }]
    }]
  }else {
    dataSource = [{
      key: 2,
      id: 2,
      deptName: `部门名称2`,
      describe:`职责描述2`,
      remark:'这是一个备注',
      children:[{
        key:`22`,
        id: 2,
        deptName: `二级部门名称2`,
        describe:`职责2`,
        remark:'二级备注',
        children:[{
          key:`222`,
          id: 2,
          deptName: `三级部门名称2`,
          describe:`职责2`,
          remark:'三级备注',
        }]
      }]
    }]
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    deptList:[{id:1,deptName: `部门名称1`,},{id:2,deptName: `部门名称2`,}],
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

export function deptManagePostRule(req, res, u, b) {
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
        deptName: `部门名称${i}`,
        description:`职责描述${i}`,
        remark:'这是一个备注',
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
  deptManageRule,
  deptManagePostRule,
};
