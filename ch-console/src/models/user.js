import { routerRedux } from 'dva/router';
import { query as queryUsers, queryCurrent,modifyPassword } from '../services/user';
import Common from '../common/Common';
import { refreshRouterData } from "../common/router";

// 默认菜单信息
const defaultMenuData = [
  {
    name: '首页',
    icon: 'home',
    path: 'home',
  }
];

const Utils = new Common();

export default {
    namespace: 'user',

    state: {
      list: [],
      currentUser: {},
      menuData: [],
    },

    effects: {
        * fetch(_, { call, put }) {
            const response = yield call(queryUsers);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        * changePassword({ payload,callback}, { call, put }) {
          const response = yield call(modifyPassword, payload.forms);
          if(response.success===true){
            yield put(routerRedux.push('/user/login'));
          }
          if(callback) callback(response);
        },
        * fetchCurrent({ callback }, { call, put }) {
          // let response = yield call(queryCurrent);
          let response = {};
          response = JSON.parse(sessionStorage.getItem("currentUser"))
          // response.username = sessionStorage.getItem("username");
          // response.logo = sessionStorage.getItem("logo");
          // response.name = response.Username
          // response.avatar = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
          // response.userid = response.Id
          // response.notifyCount = 12;
          yield put({
              type: 'saveCurrentUser',
              payload: response,
          });

          // console.log(response, 'response');
          // 设置初始状态的菜单数据，默认添加首页菜单数据,解决首次加载问题，basicLayout只渲染一次问题
          let menuData;
          if (Utils.isNotNull(response)) {
            let menu = response.functionList;
            menuData = Utils.formatterMenu(menu);
          } else {
            menuData = Utils.formatterMenu(defaultMenuData);
          }
          //路由刷新
          refreshRouterData(Array.isArray(menuData) ? menuData : []);
          yield put({
            type: 'saveMenu',
            payload: Array.isArray(menuData) ? menuData : [],
          });
          if(callback) callback(response);
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
        saveCurrentUser(state, action) {
            return {
                ...state,
                currentUser: action.payload,
            };
        },
        changeNotifyCount(state, action) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload,
                },
            };
        },
        saveMenu(state, action) {
          return {
            ...state,
            menuData: action.payload,
          };
        },
    },
};
