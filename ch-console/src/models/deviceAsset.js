import { queryDevice, queryDeviceByOrg, deviceAdd, deviceUpdate, deviceRemove, queryDeviceToMap } from '../services/devices';

export default {
  namespace: 'deviceAsset',

  state: {
    data: {},
    result: {},
    totalCount: '',
    deviceDataByOrg: {
      data: [],
      totalCount: 0,
    },
    deviceDataToMap: {
      data: [],
      totalCount: 0,
    },
  },

  effects: {
    *fetchDevice({ payload }, { call, put }) {
      const response = yield call(queryDevice, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'query',
        payload: response,
      });
    },
    *fetchDeviceByOrg({ payload, callback }, { call, put }) {
      const response = yield call(queryDeviceByOrg, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'saveDeviceByOrg',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchDeviceToMap({ payload, callback }, { call, put }) {
      const response = yield call(queryDeviceToMap, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'saveDeviceByOrg',
        payload: response,
      });
      if (callback) callback(response);
    },
    *addDevice({ payload, callback }, { call, put }) {
      const response = yield call(deviceAdd, payload);
      if (callback) callback(response);
    },
    *updateDevice({ payload, callback }, { call, put }) {
      const response = yield call(deviceUpdate, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback(response);
    },
    *removeDevice({ payload, callback }, { call, put }) {
      const response = yield call(deviceRemove, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback(response);
    },
  },

  reducers: {
    query(state, action) {
      // console.log(action, 'action');
      return {
        ...state,
        data: action.payload,
        totalCount: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        result: action.payload,
      };
    },
    saveDeviceByOrg(state, action) {
      return {
        ...state,
        deviceDataByOrg: action.payload,
      };
    },
    saveDeviceToMap(state, action) {
      return {
        ...state,
        deviceDataToMap: action.payload,
      };
    },
  },
};
