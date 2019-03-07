import { parkinghis,parkinghisByWeek,queryCarIllegalParkByWeek,queryCustomersCountByDay,
  queryCustomersCountByWeek, queryDevicesCountByWeek, queryNoticesByWeek,
  queryIncomingRaningByWeek, queryIncomingSummaryByWeek, queryIncomingSummaryByDay } from '../services/home';
import Common from '../common/Common';

const Utils = new Common();

export default {
  namespace: 'home',

  state: {
    // 停车次数(当天)
    parkinghisDataByDay: {},
    // 新增用户(当天)
    customersDataByDay: {},
    // 违停数(本周)
    carillegalparkDataByWeek: {},
    // 收入统计当日
    incomingSummaryByDay: {},
    // 停车次数，包含违停数(最近7天)
    parkinghisDataByWeek:{
      data: {
        list: [],
        date: [],
      },
    },
    // 新增用户(最近7天)
    customersDataByWeek: {
      data: {
        list: [],
        date: [],
      }
    },
    // 新增设备数量(最近7天)
    deviceDataByWeek: {
      data: {
        list: [],
        date: [],
      }
    },

    // 公告信息
    noticesData: {
      data: [],
    },
    // 收入排行榜
    incomingRaningData: {
      data: [],
    },
    // 收入统计最近7天
    incomingSummaryData: {
      data: {
        list: [],
        date: [],
      },
    },
  },

  effects: {
    // 查询停车次数(当天)
    *fetchParkinghisDataByDay({ payload ,callback}, { call, put }) {
      const response = yield call(parkinghis, payload);
      if(!response.success){
        response.totalCount='';
      }
      yield put({
        type: 'saveParkinghisDataByDay',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 查询新增用户(当天)
    *fetchCustomersDataByDay({ payload ,callback}, { call, put }) {
      const response = yield call(queryCustomersCountByDay, payload);
      if(!response.success){
        response.totalCount='';
      }
      yield put({
        type: 'saveCustomersDataByDay',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 查询违停数
    *fetchCarillegalparkDataByDay({ payload ,callback}, { call, put }) {
      const response = yield call(queryCarIllegalParkByWeek, payload);
      if(!response.success){
        response.totalCount='';
      }
      yield put({
        type: 'saveCarillegalparkDataByWeek',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 查询收入统计当天
    *fetchIncomingSummaryByDay({ payload ,callback}, { call, put }) {
      const response = yield call(queryIncomingSummaryByDay, payload);
      if(!response.success){
        response.totalCount='';
      }
      yield put({
        type: 'saveIncomingSummaryByDay',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 查询停车次数，包含违停数(最近7天)
    *fetchParkinghisDataByWeek({ payload ,callback}, { call, put }) {
      const response = yield call(parkinghisByWeek, payload);
      if(!response.success){
        response.data={
          list: '',
          date: '',
        };
      }
      yield put({
        type: 'saveParkinghisDataByWeek',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 查询新增用户(最近7天)
    *fetchCustomersDataByWeek({ payload ,callback}, { call, put }) {
      const response = yield call(queryCustomersCountByWeek, payload);
      if(!response.success){
        response.data={
          list: '',
          date: '',
        };
      }
      yield put({
        type: 'saveCustomersDataByWeek',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 查询新增设备数量(最近7天)
    *fetchDeviceDataByWeek({ payload ,callback}, { call, put }) {
      const response = yield call(queryDevicesCountByWeek, payload);
      if(!response.success){
        response.data={
          list: '',
          date: '',
        };
      }
      yield put({
        type: 'saveDeviceDataByWeek',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 公告查询
    *fetchNotices({ payload ,callback}, { call, put }) {
      const response = yield call(queryNoticesByWeek, payload);
      if(!response.success){
        response.data='';
      }
      yield put({
        type: 'saveNoticesData',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 收入排行查询
    *fetchIncomingRaning({ payload ,callback}, { call, put }) {
      const response = yield call(queryIncomingRaningByWeek, payload);
      if(!response.success){
        response.data='';
      }
      yield put({
        type: 'saveIncomingRaning',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 收入统计查询-最近7天
    *fetchIncomingSummary({ payload ,callback}, { call, put }) {
      const response = yield call(queryIncomingSummaryByWeek, payload);
      if(!response.success){
        response.data={
          list: '',
          date: '',
        };
      }
      yield put({
        type: 'saveIncomingSummary',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    saveParkinghisDataByDay(state, action,response) {
      return {
        ...state,
        parkinghisDataByDay: action.payload,
      };
    },

    saveCustomersDataByDay(state, action,response) {
      return {
        ...state,
        customersDataByDay: action.payload,
      };
    },

    saveCarillegalparkDataByWeek(state, action,response) {
      return {
        ...state,
        carillegalparkDataByWeek: action.payload,
      };
    },

    saveIncomingSummaryByDay(state, action,response) {
      return {
        ...state,
        incomingSummaryByDay: action.payload,
      };
    },

    saveParkinghisDataByWeek(state, action,response) {
      return {
        ...state,
        parkinghisDataByWeek: action.payload,
      };
    },

    saveCustomersDataByWeek(state, action,response) {
      return {
        ...state,
        customersDataByWeek: action.payload,
      };
    },

    saveDeviceDataByWeek(state, action,response) {
      return {
        ...state,
        deviceDataByWeek: action.payload,
      };
    },

    saveNoticesData(state, action,response) {
      return {
        ...state,
        noticesData: action.payload,
      };
    },

    saveIncomingRaning(state, action,response) {
      return {
        ...state,
        incomingRaningData: action.payload,
      };
    },

    saveIncomingSummary(state, action,response) {
      return {
        ...state,
        incomingSummaryData: action.payload,
      };
    },
  },
};
