import { specialCarQuery, specialCarAdd, specialCarUpdate, specialCarDel } from '../services/specialCarManage';

export default {
  namespace: 'specialCarManage',

  state: {
    specialCarData: {
      data: [],
      totalCount: '',
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(specialCarQuery, payload);
      if(!response.success){
        response.data=[];
        response.totalCount=0;
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(specialCarAdd, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(specialCarUpdate, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(specialCarDel, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        specialCarData: action.payload,
      };
    },
  },
};
