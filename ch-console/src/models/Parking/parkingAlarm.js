import { parkingAlarmQuery } from '../../services/parking';

// 停车管理-停车告警
export default {
  namespace: 'parkingAlarm',

  state: {
    parkingAlarmData: {
      data: [],
      totalCount: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(parkingAlarmQuery, payload);
      if(!response.success){
        response.data=[];
        response.totalCount='';
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        parkingAlarmData: action.payload,
      };
    },
  },
};
