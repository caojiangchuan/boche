import { disobeyInfoManageQuery, disobeyInfoManageAdd, disobeyInfoManageDel } from '../services/disbeyInfoManage';

export default {
  namespace: 'disobeyInfoManage',

  state: {
    data: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(disobeyInfoManageQuery, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(disobeyInfoManageAdd, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(disobeyInfoManageDel, payload);
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
        data: action.payload,
      };
    },
  },
};
