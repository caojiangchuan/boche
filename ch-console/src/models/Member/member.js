import { queryMember, queryMemberDetail, carInfoByCustomerQuery } from '../../services/member';

// 用户管理-会员管理
export default {
  namespace: 'member',

  state: {
    memberData: {
      data: [],
      totalCount: '',
    },
    memberDetail: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryMember, payload);
      if(!response.success){
        response.data=[];
        response.totalCount='';
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryMemberDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchCustomerCars({ payload, callback }, { call, put }) {
      const response = yield call(carInfoByCustomerQuery, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
        response.success = false;
      }
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        memberData: action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        memberDetail: action.payload,
      };
    },
  },
};
