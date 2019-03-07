import { deviceRepairQuery, deviceRepairUpdate,deviceRepairMessage } from '../services/deviceRepair';

export default {
  namespace: 'deviceRepair',

  state: {
    data: {},
    totalCount: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(deviceRepairQuery, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(deviceRepairUpdate, payload);
      if (callback) callback(response);
    },
    *deviceRepairMessage({ payload, callback }, { call, put }) {
      const response = yield call(deviceRepairMessage, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
        totalCount: action.payload,
      };
    },
  },
};
