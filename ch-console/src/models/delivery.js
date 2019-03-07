import { query, add } from '../services/delivery';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'delivery',
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
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload }, { put }) {
      console.log('====公告添加====');
      // effects里面触发action的方法是yield put
      yield put({ type: 'saveNoticeDetail', payload: {} });
      yield put(routerRedux.push('/notices/new'));
    },
    *routeToEdit({ payload }, { call, put }) {
      yield put({ type: 'saveNoticeDetail', payload });
      yield put(routerRedux.push('/notices/new'));
    },
    *formSubmit({ payload, callback }, { call, put }) {
      // effects里面调用services的方法是yield call
      const id = yield call(add, payload.forms);
      if (id) {
        //拿到http请求数据后触发reducer修改state的数据
        yield put(routerRedux.push('/notices/noticeList'));
      }
    },
    *showModal({ payload }, { put }) {
      yield put({
        type: 'toggleMap',
        payload: payload,
      });
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
