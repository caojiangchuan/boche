import { noticesManageQuery, noticesManageAdd, noticesManageUpdate, noticesManageDel } from '../services/noticesManage';

export default {
  namespace: 'noticesManage',

  state: {
    noticesData: {
      data: [],
      totalCount: 0,
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(noticesManageQuery, payload);
      if(!response.success){
        response.data = [];
        response.totalCount = 0;
      }
      yield put({
        type: 'saveNoticesData',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(noticesManageAdd, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(noticesManageUpdate, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(noticesManageDel, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    saveNoticesData(state, action) {
      return {
        ...state,
        noticesData: action.payload,
      };
    },
  },
};
