import { roleManageQuery, roleManageAdd, roleManageUpdate, roleManageDel, roleManageQueryDetail } from '../services/roleManage';

export default {
  namespace: 'roleManage',

  state: {
    roleData: {},
    roleDetail: {
      functionList: [],
    },
    functionData: {},
    totalCount: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(roleManageQuery, payload);
      if(!response.success){
        response.roleData=[];
        response.totalCount = '';
      }
      yield put({
        type: 'saveRoleData',
        payload: response,
      });
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(roleManageQueryDetail, payload);
      yield put({
        type: 'saveRoleDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(roleManageAdd, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(roleManageUpdate, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(roleManageDel, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    saveRoleData(state, action) {
      return {
        ...state,
        roleData: action.payload,
        totalCount: action.payload,
      };
    },

    saveRoleDetail(state, action) {
      return {
        ...state,
        roleDetail: action.payload,
      };
    },

    saveFunctionData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
