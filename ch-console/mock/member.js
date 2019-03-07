import { parse } from 'url'; // 现金充值数据

let memberDataSource = [];
for (let i = 1; i < 46; i += 1) {
  memberDataSource.push({
    key: i,
    name: `人员姓名 ${i}`,
    phoneNumber: `131 ${i}`,
    createDate: new Date().toLocaleTimeString(),
  });
}

export function getMemberInfo(req, res, u) {
  console.log('456978');
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...memberDataSource];

  console.log(dataSource);
  if (params.keywords) {
    dataSource = dataSource.filter(
      data => data.name === params.keywords || data.phoneNumber === params.keywords
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
