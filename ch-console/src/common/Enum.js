/** 摄像头位置**/
export const cameraStatus =[{name:"左",value:'0'},{name:"右",value:'1'}];

//车位状态
export const carFieldStatus =[{name:"占用",value:'2'},{name:"空闲",value:'3'}, {name:"禁用",value:'4'}];

// 资产状态
export const assetStatus = [
  {name:"新购入库",value:'0'},{name:"投放使用",value:'1'},
  {name:"返厂维修",value:'2'},{name:"修后入库",value:'3'},
  {name:"修后重用",value:'4'},{name:"试点借用",value:'5'},
  {name:"报废",value:'6'},
];

// 启用状态
export const enableStatus = [
  {name:"启用",value:'0'},{name:"未启用",value:'1'},{name:"关闭",value:'2'},
];

// 性别选项
export const sexStatus = [
  {name:"男",value:'男'},{name:"女",value:'女'},
];

// 员工在职状态选项
export const dutyStatus = [
  {name:"正式员工",value:'0'},{name:"临时员工",value:'1'},
];

// 运营人员类型
export const employeeType = [
  {name:"巡检员",value:'0'},{name:"维修人员",value:'1'},
];

//是否按半小时收费
export const enableHalfHour = [{name:"是",value:'true'},{name:"否",value:'false'}];

// 设备报修状态
export const deviceRepairStatus = [
  {name:"已提交",value:'1'},{name:"已受理",value:'2'},{name:"已完成",value:'3'},
];
