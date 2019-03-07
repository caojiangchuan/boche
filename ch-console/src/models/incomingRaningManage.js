import { incomingRaningQuery } from '../services/incomingRaningManage';

export default {
  namespace: 'incomingRaningManage',

  state: {
    incomingData: {
      data: [],
      totalCount: 0,
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(incomingRaningQuery, payload);
      if(!response.success){
        response.data = [];
        response.totalCount = 0;
      } else {
        response.totalCount = response.data.length;
      }
      yield put({
        type: 'saveIncomingData',
        payload: response,
      });
    },
  },

  reducers: {
    saveIncomingData(state, action) {
      return {
        ...state,
        incomingData: action.payload,
      };
    },
  },
};
