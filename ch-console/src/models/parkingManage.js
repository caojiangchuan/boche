import { parkingManageQuery, parkFieldUpdate, parkingManageDel,getCarFieldList,parkFieldDel,parkingFieldAdd,parkingAdd,parkingUpdate,parkingDel,addArea,getCarFieldListByArea,updateArea,delArea,getParkList, getParkPositionStatusCount, getAreaPositionStatusCount, parkPositionStatusUpdate } from '../services/parkingManage';

export default {
  namespace: 'parkingManage',

  state: {
    data: {
      list: [],
      totalCount: 0,
    },
    carList:{
      data:[],
      totalCount:0,
    }
  },

  effects: {
    //获取停车场列表
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(parkingManageQuery, payload);
      if(!response.success){
        response.data=[];
      }
      yield put({
        type: 'save',
        payload: response,
      });

      if(callback) callback(response);
    },
    //新增停车场
    *addPark({ payload,callback }, { call, put }) {
      const response = yield call(parkingAdd, payload);
      if(callback) callback(response);
    },

    //修改停车场
    *updatePark({ payload,callback }, { call, put }) {
      const response = yield call(parkingUpdate, payload);
      if(callback) callback(response);
    },

    //删除停车场
    *removePark({ payload,callback }, { call, put }) {
      const response = yield call(parkingDel, payload);
      if(callback) callback(response);
    },

    //获取泊位列表,根据停车场
    *getCarFieldList({ payload,callback }, { call, put }) {
      const response = yield call(getCarFieldList, payload);
      if(!response.success){
        response.data=[];
      }
      yield put({
        type: 'carFieldList',
        payload: response,
      });
      if (callback) callback(response);
    },

    //获取泊位列表,根据片区
    *getCarFieldListByArea({ payload,callback }, { call, put }) {
      const response = yield call(getCarFieldListByArea, payload);
      if(!response.success){
        response.data=[];
      }
      yield put({
        type: 'carFieldList',
        payload: response,
      });
      if (callback) callback(response);
    },

    //修改泊位
    *updateField({payload, callback }, { call, put }){
      const response = yield call(parkFieldUpdate, payload);
      if (callback) callback(response);
    },

    //修改泊位
    *updateParkPositionStatus({payload, callback }, { call, put }){
      const response = yield call(parkPositionStatusUpdate, payload);
      if (callback) callback(response);
    },

    //删除泊位
    *removeField({payload, callback }, { call, put }){
      const response = yield call(parkFieldDel, payload);
      if (callback) callback(response);
    },

    //新增泊位
    *addParkingField({ payload, callback }, { call, put }) {
      const response = yield call(parkingFieldAdd, payload);
      if (callback) callback(response);
    },
    //新增片区
    *addArea({ payload, callback }, { call, put }) {
      const response = yield call(addArea, payload);
      if (callback) callback(response);
    },

    // //修改片区
    *updateArea({payload, callback }, { call, put }){
      const response = yield call(updateArea, payload);
      if (callback) callback(response);
    },

    //删除片区
    *delArea({ payload,callback }, { call, put }) {
      const response = yield call(delArea, payload);
      if(callback) callback(response);
    },

    //获取停车场，作为下拉框用
    *getParkList({ payload,callback }, { call }){
      const response = yield call(getParkList, payload);
      if(callback) callback(response);
    },

    // 通过停车场获取泊位使用信息
    *getParkPositionStatusCount({ payload,callback }, { call }){
      const response = yield call(getParkPositionStatusCount, payload);
      if(callback) callback(response);
    },

    // 通过片区获取泊位使用信息
    *getAreaPositionStatusCount({ payload,callback }, { call }){
      const response = yield call(getAreaPositionStatusCount, payload);
      if(callback) callback(response);
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    carFieldList(state, action){
      return {
        ...state,
        carList: action.payload,
      };
    }
  },
};
