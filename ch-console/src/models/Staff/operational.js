import { queryOperational, operationalAdd, operationalUpdate, operationalRemove } from '../../services/staff';

export default {
  namespace: 'operational',

  state: {
    data: {},
    totalCount: '',
  },

  effects: {
    *fetch({ payload , callback}, { call, put }) {
      const response = yield call(queryOperational, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(operationalAdd, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(operationalUpdate, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(operationalRemove, payload);
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
