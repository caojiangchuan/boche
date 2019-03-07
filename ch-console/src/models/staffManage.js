import { staffManageQuery, staffManageAdd, staffManageRemove,staffManageUpdate,
  staffManageUpdatePwd, staffManageUpdateLoginStatus, staffManageUpdateRole,
  staffManageQueryByOrg, staffManageQueryByDept} from '../services/staffManage';

export default {
  namespace: 'staffManage',

  state: {
    staffData: {},
    totalCount: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(staffManageQuery, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // 根据组织编号查询员工信息
    *fetchByOrg({ payload }, { call, put }) {
      const response = yield call(staffManageQueryByOrg, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // 根据部门编号查询员信息
    *fetchByDept({ payload }, { call, put }) {
      const response = yield call(staffManageQueryByDept, payload);
      if(!response.success){
        response.data=[];
        response.totalCount = '';
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
    //根据组织id获取下辖部门
    *getStaff({ payload }, { call, put }){
      const response = yield call(staffManageUpdate, payload);
      if(!response.success){
        response.data=[];
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(staffManageAdd, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(staffManageUpdate, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(staffManageRemove, payload);
      if (callback) callback(response);
    },
    *updatePwd({ payload, callback }, { call }) {
      const response = yield call(staffManageUpdatePwd, payload);
      if (callback) callback(response);
    },
    *updateLoginStatus({ payload, callback }, { call }) {
      const response = yield call(staffManageUpdateLoginStatus, payload);
      if (callback) callback(response);
    },
    *updateRole({ payload, callback }, { call }) {
      const response = yield call(staffManageUpdateRole, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        staffData: action.payload,
        totalCount: action.payload,
      };
    },
  },
};
