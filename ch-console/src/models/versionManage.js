import { versionManageQuery } from '../services/versionManage';

export default {
  namespace: 'versionManage',

  state: {
    versionData: {
      data: {}
    }
  },

  effects: {
    * fetch({payload, callback}, {call, put}) {
      const response = yield call(versionManageQuery, payload);
      if (!response.success) {
        response.data = {}
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        versionData: action.payload,
      };
    },
  },
};
