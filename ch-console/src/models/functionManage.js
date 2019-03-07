import { functionManageQuery } from '../services/functionManage';

export default {
  namespace: 'functionManage',

  state: {
    functionData: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(functionManageQuery, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        functionData: action.payload,
      };
    },
  },
};
