import {queryWechatText,addWechatText,updateWechatText,deleteWechatText} from '../services/wechatText';
export default {
  namespace: 'wechatText',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    showModal: false,
    noticeDetail: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryWechatText, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *update({ payload,callback }, { call, put }) {
      yield call(updateWechatText, payload);
      yield call(callback,{})
    },
    *add({ payload, callback}, {call, put }) {
      yield call(addWechatText, payload);
      yield call(callback, {})
    },
    *delete({ payload, callback }, { call, put }) {
      yield call(deleteWechatText, payload);
      yield call(callback, {})
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    toggleMap(state, action) {
      return {
        ...state,
        showModal: action.payload,
      };
    }
  },
};
