import { queryParkingOrder, queryParkingOrderDetail } from '../../services/parking';

export default {
  namespace: 'parkingOrder',

  state: {
    parkingOrderData: {
      data: [],
      totalCount: 0,
    },
    // 用户订单信息
    customerOrderData: {
      data: [],
      totalCount: 0,
    }
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryParkingOrder, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = 0;
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchOrderDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryParkingOrderDetail, payload);
      if (callback) callback(response);
    },
    *fetchCustomerOrder({ payload, callback }, { call, put }) {
      const response = yield call(queryParkingOrder, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'saveCustomerOrder',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        parkingOrderData: action.payload,
      };
    },
    saveCustomerOrder(state, action) {
      return {
        ...state,
        customerOrderData: action.payload,
      };
    },
  },
};
