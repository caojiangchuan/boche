import { queryRule, removeRule, addRule } from '../services/api';
import { query, laodOffWorkUsers ,getUserDetail} from '../services/user'
import { routerRedux } from 'dva/router';

export default {
  namespace: 'customer',

  state: {
    detail:{},
    data: {
      list: [],
      pagination: {},
    },
    showModal: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *detail({ payload }, { call, put }) {
      yield put({
        type: 'saveDetail',
        payload: payload
      })
      console.log('===会员信息查看====');
      yield put(routerRedux.push('/customer/customerDetail'));
    },
    *showModal({ payload }, { put }) {
      yield put({
        type: 'toggleMap',
        payload: payload,
      });
    },
    *timeBoard({ payload }, { call, put }) {
      console.log('===会员看板信息查看====');
      yield put(routerRedux.push('/customer/timeBoard'));
    },
    *laodOffWorkUsers({payload},{call, put}){
      const response = yield call(laodOffWorkUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    }
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
    saveDetail(state,action){
      return {
        ...state,
        detail: action.payload
      }
    },
  },
};
