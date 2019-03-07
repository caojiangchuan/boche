import {deptManageAdd, deptManageDel,getDept,deptManageUpdate} from '../services/deptManage';
import {organizationUpdate} from "../services/organizationManage";
import Common from '../common/Common';

const Utils = new Common();

export default {
  namespace: 'deptManage',

  state: {
    data: {
      data: [],
      list: [],
      pagination: {},
    },
    deptData: [],
  },

  effects: {
    *fetch({ payload ,callback}, { call, put }) {
      const response = yield call(getDept, payload);
      if(!response.success){
        response.data=[]
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取所有部门信息(List)
    *fetchAll({ payload ,callback}, { call, put }) {
      const response = yield call(getDept, payload);
      if(!response.success){
        response.data=[]
      }
      // 将树形数据转换成List数据
      const depts = Utils.treeConvertList(response.data);
      yield put ({
        type: 'saveDeptData',
        payload: depts,
      });
      if (callback) callback(response);
    },
    //新增
    *add({ payload, callback }, { call, put }) {
      const response = yield call(deptManageAdd, payload);
      if (callback) callback(response);
    },

    //更新
    *update({ payload, callback }, { call, put }) {
      const response = yield call(deptManageUpdate, payload);
      if (callback) callback(response);
    },
    //删除
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(deptManageDel, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action,response) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveDeptData(state, action,response) {
      return {
        ...state,
        deptData: action.payload,
      };
    },
  },
};
