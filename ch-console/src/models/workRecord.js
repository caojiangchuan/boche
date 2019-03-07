import { queryMatchUser, deleteWorkRecord } from '../services/workRecord';

export default {
  namespace: 'workRecord',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMatchUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *delete({ payload,callback }, { call, put }){
      yield call(deleteWorkRecord,payload)
      yield call(callback,{})
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
