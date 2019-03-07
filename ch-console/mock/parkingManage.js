import {parse} from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 21; i += 1) {
  tableListDataSource.push({
    key: i,
    id: i,
    parkingNo:`大拇指-${i}`,
    operateStatus:'收费运营',
    staffName: `${i/2===0?'空闲':'占用'}`,
    carNo: `沪A8888${i}`,
    time: `${i*10}分钟`,
    fee: `${((i*10)/20)*2}元`,
    deptName: `部门${i}`,
    status: '正常',
  });
}

export function parkingManageRule(req, res, u) {
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
      parentNo:'',
      deptName: `大拇指停车场`,
      children: [{
        key: `22`,
        id: 22,
        parentNo:'1',
        deptName: `10-2-1`,
      }, {
        key: `44`,
        id: 44,
        parentNo:'1',
        deptName: `20-1-1`,
      }]
    },{
      key: 55,
      id: 55,
      parentNo:'',
      deptName: `大拇指停车场`,
      children: [{
        key: `66`,
        id: 66,
        parentNo:'55',
        deptName: `10-2-1`,
      }, {
        key: `77`,
        id: 77,
        parentNo:'55',
        deptName: `20-1-1`,
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

export function getCarFieldRule(req, res, u) {
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
        parkingNo:`大拇指-${i}`,
        operateStatus:'收费运营',
        staffName: `${i/2===0?'空闲':'占用'}`,
        carNo: `沪A8888${i}`,
        time: `${i*10}分钟`,
        fee: `${((i*10)/20)*2}元`,
        deptName: `部门${i}`,
        status: '正常',
      });
    }

  } else {
    for (let i = 0; i < 5; i += 1) {
      dataSource.push({
        key: i,
        id: i,
        parkingNo:`大拇指-${i}`,
        operateStatus:'收费运营',
        staffName: `${i/2===0?'空闲':'占用'}`,
        carNo: `沪A8888${i}`,
        time: `${i*10}分钟`,
        fee: `${((i*10)/20)*2}元`,
        deptName: `部门${i}`,
        status: '正常',
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
      parentNo:'',
      deptName: `大拇指停车场`,
      children: [{
        key: `22`,
        id: 22,
        parentNo:'1',
        deptName: `10-2-1`,
      }, {
        key: `44`,
        id: 44,
        parentNo:'1',
        deptName: `20-1-1`,
      }]
    },{
      key: 55,
      id: 55,
      parentNo:'',
      deptName: `大拇指停车场`,
      children: [{
        key: `66`,
        id: 66,
        parentNo:'55',
        deptName: `10-2-1`,
      }, {
        key: `77`,
        id: 77,
        parentNo:'55',
        deptName: `20-1-1`,
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

export function parkingManagePostRule(req, res, u, b) {
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
  parkingManageRule,
  parkingManagePostRule,
};
