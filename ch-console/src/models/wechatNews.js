import { queryWechatNews,addWechatNews,updateWechatNews,deleteWechatNews} from '../services/wechatNews';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'wechatNews',
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
      const response = yield call(queryWechatNews, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *update({ payload, callback}, { call, put }) {
      yield call(updateWechatNews, payload);
      yield call(callback,{})
    },
    *add({ payload, callback}, { call,put }) {
      yield call(addWechatNews, payload);
      yield call(callback, {})
    },
    *delete({ payload, callback}, {call, put }) {
      yield call(deleteWechatNews, payload);
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
    },
    saveNoticeDetail(state, action) {
      return {
        ...state,
        noticeDetail: action.payload,
      };
    },
  },
};
