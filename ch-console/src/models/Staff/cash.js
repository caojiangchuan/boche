import { queryEmployeeCash, cashRecharge, queryCashDetail, cashUpdate } from '../../services/staff';

export default {
  namespace: 'cash',

  state: {
    employeeCashData: {
      data: [],
      totalCount: '',
    },
    result: {},
  },

  effects: {
    // 查询巡检人员
    *fetchEmployeeCash({ payload }, { call, put }) {
      const response = yield call(queryEmployeeCash, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'queryEmployeeCash',
        payload: response,
      });
    },
    // 现金充值
    *cashRecharge({ payload, callback }, { call, put }) {
      const response = yield call(cashRecharge, payload);
      if (callback) callback(response);
    },
    // 查询充值明细
    *fetchCashDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryCashDetail, payload);
      if (callback) callback(response);
    },
    // 修改金额
    *updateCash({ payload, callback }, { call, put }) {
      const response = yield call(cashUpdate, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    queryEmployeeCash(state, action) {
      return {
        ...state,
        employeeCashData: action.payload,
      };
    },
  },
};
