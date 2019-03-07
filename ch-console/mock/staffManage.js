import {parse} from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 21; i += 1) {
  tableListDataSource.push({
    key: i,
    id: i,
    staffName: `姓名${i}`,
    staffPhoto: `图像${i}`,
    sex: '男/女',
    tel: '13088886666',
    deptName: `部门${i}`,
    status: '在职',
  });
}

export function staffManageRule(req, res, u) {
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
    list: dataSource,
    deptList: [{
      key: 1,
      id: 1,
      deptName: `运营公司`,
      describe: `职责描述1`,
      remark: '这是一个备注',
      children: [{
        key: `22`,
        id: 22,
        deptName: `管理部门`,
        describe: `职责1`,
        remark: '二级备注',
        children: [{
          key: `33`,
          id: 33,
          deptName: `管理二组`,
          describe: `职责1`,
          remark: '三级备注',
        }]
      }, {
        key: `44`,
        id: 44,
        deptName: `运营部门`,
        describe: `职责1`,
        remark: '二级备注',
        children: [{
          key: `55`,
          id: 55,
          deptName: `运营一组`,
          describe: `职责1`,
          remark: '三级备注',
        }]

      }]
    }],
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

export function getStaff(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = [];

  if (params.id === '1') {
    for (let i = 0; i < 11; i += 1) {
      dataSource.push({
        key: i,
        id: i,
        staffName: `姓名${i}`,
        staffPhoto: `图像${i}`,
        sex: '男/女',
        tel: '13088886666',
        deptName: `部门${i}`,
        status: '在职',
      });
    }

  } else {
    for (let i = 0; i < 5; i += 1) {
      dataSource.push({
        key: i,
        id: i,
        staffName: `姓名${i}`,
        staffPhoto: `图像${i}`,
        sex: '男/女',
        tel: '13088886666',
        deptName: `部门${i}`,
        status: '在职',
      });
    }
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    deptList: [{
      key: 1,
      id: 1,
      deptName: `运营公司`,
      describe: `职责描述1`,
      remark: '这是一个备注',
      children: [{
        key: `22`,
        id: 22,
        deptName: `管理部门`,
        describe: `职责1`,
        remark: '二级备注',
        children: [{
          key: `33`,
          id: 33,
          deptName: `管理二组`,
          describe: `职责1`,
          remark: '三级备注',
        }]
      }, {
        key: `44`,
        id: 44,
        deptName: `运营部门`,
        describe: `职责1`,
        remark: '二级备注',
        children: [{
          key: `55`,
          id: 55,
          deptName: `运营一组`,
          describe: `职责1`,
          remark: '三级备注',
        }]

      }]
    }],
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

export function staffManagePostRule(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const {method, no} = body;

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
        description: `职责描述${i}`,
        remark: '这是一个备注',
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
  staffManageRule,
  staffManagePostRule,
};
