import { parkingArrearsQuery, parkingArrearsSend } from '../../services/parking';

// 停车管理-欠费催缴
export default {
  namespace: 'parkingArrears',

  state: {
    parkingArrearsData: {
      data: [],
      totalCount: '',
    }
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(parkingArrearsQuery, payload);
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
    // 短信催缴
    *messageArrears({ payload, callback }, { call }) {
      const response = yield call(parkingArrearsSend, payload);
      if (callback) callback(response);
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        parkingArrearsData: action.payload,
      };
    },
  },
};
