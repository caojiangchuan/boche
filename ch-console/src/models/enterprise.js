import { query, add } from '../services/enterprise';
import { routerRedux } from 'dva/router';
import { defaultCipherList } from 'constants';
export default {
  namespace: 'enterprise',

  state: {
    data: {
      list: [],
      pagination: {},
    },
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
      yield put(routerRedux.push('/enterprise/list'));
    },
    *add({ payload, callback }, { call, put }) {
      yield put(routerRedux.push('/enterprise/new'));
    },
    *detail({ payload}, {put }) {
      yield put({
        type: 'saveDetail',
        payload: payload
      })
      yield put(routerRedux.push('/enterprise/detail'));
    },
    *gotoProjectList({ payload}, {put }) {
      yield put(routerRedux.push({ pathname: '/project/list', params: payload}));
    },
    *formSubmit({payload,callback},{call,put}){
      yield call(add,payload)
      yield put(routerRedux.push('/enterprise/list'));
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveDetail(state,action){
      return {
        ...state,
        detail: action.payload
      }
    }
  },
};
