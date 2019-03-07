import { settlementQuery,timeListQuery,addSettlement,updateSettlement,
  removeSettlement,addTime,removeTime,updateTime,getParkingList} from '../services/settlementService';
import Common from '../common/Common';

const Utils = new Common();


export default {
  namespace: 'settlement',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    childData:{
      list:[],
    },
    parkList:{
      list:[],
    }
  },

  effects: {
    //获取策略列表
    *fetch({ payload,callback}, { call, put }) {
      const response = yield call(settlementQuery, payload);
      if(!response.success){
        response.data=[];
      }
      yield put({
        type: 'save',
        payload: response,
      });
      if(callback) callback(response);
    },

    //新增策略
    *addSettlement({ payload, callback }, { call, put }) {
      const response = yield call(addSettlement, payload);
      if (callback) callback(response);
    },

    //修改策略
    *updateSettlement({ payload, callback }, { call, put }) {
      const response = yield call(updateSettlement, payload);
      if (callback) callback(response);
    },

    //删除策略
    *removeSettlement({ payload, callback }, { call, put }) {
      const response = yield call(removeSettlement, payload);
      if (callback) callback(response);
    },

    //获取时间段列表
    *getTimeList({ payload,callback}, { call, put }){
      let response = {}
      if(Utils.isNotNull(payload.id)){
        response = yield call(timeListQuery, payload);
      }else{
        response.success='success';
        response.data=[];
      }
      if(!response.success){
        response.data=[];
      }
      yield put({
        type: 'timeList',
        payload: response,
      });
      if(callback) callback(response);
    },

    //新增时间段
    *addTime({ payload, callback }, { call, put }) {
      const response = yield call(addTime, payload);
      if (callback) callback(response);
    },

    //删除时间段
    *removeTime({ payload, callback }, { call, put }) {
      const response = yield call(removeTime, payload);
      if (callback) callback(response);
    },

    //修改时间段
    *updateTime({ payload, callback }, { call, put }) {
      const response = yield call(updateTime, payload);
      if (callback) callback(response);
    },

    *getParkingList({ payload, callback }, { call, put }) {
      const response = yield call(getParkingList, payload);
      if(!response.success){
        response.data=[];
      }
      yield put({
        type: 'park',
        payload: response,
      });
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
    timeList(state, action) {
      return {
        ...state,
        childData: action.payload,
      };
    },
    park(state, action) {
      return {
        ...state,
        parkList: action.payload,
      };
    },
  },
};
