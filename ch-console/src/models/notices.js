import { query, add, modify } from '../services/notices';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'notices',
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
    *list({ payload }, { call, put }) {
      yield put(routerRedux.push('/notices/noticeList'));
    },
    *add({ payload }, { put }) {
      console.log('====公告添加====');
      // effects里面触发action的方法是yield put
      yield put({ type: 'saveNoticeDetail', payload: {} });
      yield put(routerRedux.push('/notices/new'));
    },
    *routeToEdit({ payload }, { call, put }) {
      console.log('====公告修改====');
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
