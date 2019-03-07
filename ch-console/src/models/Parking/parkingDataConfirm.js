import { parkingDataConfirmQuery, parkingDataConfirmUpdate } from '../../services/parking';

export default {
  namespace: 'parkingDataConfirm',

  state: {
    data: {},
    totalCount: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(parkingDataConfirmQuery, payload);
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
      const response = yield call(parkingDataConfirmUpdate, payload);
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
