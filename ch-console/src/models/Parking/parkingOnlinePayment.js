import { parkingOnlinePaymentQuery,parkingOnlinePaymentAdd, parkingOnlinePaymentRemove, parkingOnlinePaymentUpdate } from '../../services/parking';

export default {
  namespace: 'parkingOnlinePayment',

  state: {
    parkingOnlinePaymentData: {
      data: [],
      totalCount: '',
    }
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(parkingOnlinePaymentQuery, payload);
      if(!response.success){
        response.data=[];
        response.totalCount='';
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(parkingOnlinePaymentAdd, payload);
      if(!response.success){
        response.data=[];
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(parkingOnlinePaymentRemove, payload);
      if(!response.success){
        response.data=[];
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(parkingOnlinePaymentUpdate, payload);
      if(!response.success){
        response.data=[];
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        parkingOnlinePaymentData: action.payload,
      };
    },
  },
};
