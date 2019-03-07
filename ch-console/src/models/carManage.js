import { carBaseInfoManageQuery, carBaseInfoManageAdd, carBaseInfoManageUpdate, carBaseInfoManageRemove } from '../services/carBaseInfoManage';

export default {
  namespace: 'carManage',

  state: {
    data: {},
    totalCount: '',
    customerCarData: {
      data: [],
      totalCount: 0,
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(carBaseInfoManageQuery, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCustomerCars({ payload, callback }, { call, put }) {
      const response = yield call(carBaseInfoManageQuery, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'saveCustomerCars',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(carBaseInfoManageAdd, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(carBaseInfoManageUpdate, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(carBaseInfoManageRemove, payload);
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
    saveCustomerCars(state, action) {
      return {
        ...state,
        customerCarData: action.payload,
      };
    },
  },
};
