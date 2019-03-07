import { routerRedux } from 'dva/router';
import { userLogin } from '../services/staffManage';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import Common from '../common/Common';

const Utils = new Common();

export default {
  namespace: 'login',
  state: {
    status: undefined,
  },

  effects: {
    *login({ payload,callback }, { call, put }) {
      const response = yield call(userLogin, payload);

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if(response.success===false){
        response.status ='error';
        response.currentAuthority = 'guest';
      }else{
        response.status ='ok';
        response.currentAuthority = 'admin';
      }

      response.type = payload.type;
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // if (callback) callback();
      if(Utils.isNotNull(response.data) && response.data.token) {
        sessionStorage.setItem('token',response.data.token);
        sessionStorage.setItem('currentUser', JSON.stringify(response.data));
        // sessionStorage.setItem('functionList', JSON.stringify(menuData));
        // if(payload.autoLogin){
          // Cookies.set('username', payload.username);
          // Cookies.set('mm', payload.password);
          // Cookies.set('autoLogin', payload.autoLogin);
        // }
        // Login successfully
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
        sessionStorage.removeItem('token');
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // console.log(payload)
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
