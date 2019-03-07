import { organizationQuery, organizationAdd, organizationDel,organizationUpdate, organizationAndDeptQuery } from '../services/organizationManage';
import Common from '../common/Common';

const Utils = new Common();

export default {
  namespace: 'organizationManage',

  state: {
    data: {
      list: [],
      totalCount:0,
    },
    orgAndDeptData: {
      data: [],
      totalCount: 0,
    }
  },

  effects: {
    //查询数据
    *fetch({ payload, callback  }, { call, put }) {
      const response = yield call(organizationQuery, payload);
      if(!response.success){
        response.data=[]
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if(callback) callback(response);
    },
    //查询数据-包含部门信息
    *fetchOrgAndDept({ payload, callback  }, { call, put }) {
      const response = yield call(organizationAndDeptQuery, payload);
      if(!response.success){
        response.data=[];
        response.totalCount=0;
      } else {
        // 将数据中children 为空的children去掉
        const data = Utils.dataConvert(response.data);
        response.data = data;
      }
      yield put({
        type: 'saveOrgAndDept',
        payload: response,
      });
      if(callback) callback(response);
    },
    // 新增
    *add({ payload, callback }, { call, put }) {
      const response = yield call(organizationAdd, payload);
      if (callback) callback(response);
    },

    // 更新
    *update({ payload, callback }, { call, put }) {
      const response = yield call(organizationUpdate, payload);
      if (callback) callback(response);
    },

  //删除
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(organizationDel, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    saveOrgAndDept(state, action) {
      return {
        ...state,
        orgAndDeptData: action.payload,
      };
    },
  },
};
