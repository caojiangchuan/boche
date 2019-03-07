import { cacheManageQuery } from '../services/api';

export default {
  namespace: 'cacheManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(cacheManageQuery, payload);
      if(!response.success){
        response.data=[];
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
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
