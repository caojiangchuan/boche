import { queryWeather } from '../services/geographic';

export default {
  namespace: 'geographic',

  state: {
    province: [],
    city: [],
    isLoading: false,
    weather: {},
  },

  effects: {
    *fetchWeather({ payload }, { call, put }) {
      const response = yield call(queryWeather, payload);
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
        weather: action.payload,
      };
    },
  },
};
