import { query, add,addTimeSlot,addAddress, loadProjectAddress, loadProjectTimeSlot,deleteProjectAddress,deleteProjectTimeSlot } from '../services/project';
import { routerRedux } from 'dva/router';
import {queryMatchUser,matchUser} from '../services/workRecord'
export default {
  namespace: 'project',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    showModal: false,
    projectAddress:[],
    projectAddressFormStatus:'success',
    projectTimeSlot:[],
    matchUser: [],
    projectDetail:{}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload }, { put }) {
      yield put({type:'saveProjectDetail',payload:{}})
      yield put(routerRedux.push('/project/new'));
    },
    *routeToEdit({ payload }, { call, put }){
      yield put({type:'saveProjectDetail',payload})
      yield put(routerRedux.push('/project/new'));
    },
    *formSubmit({ payload, callback }, { call, put }) {
      const id = yield call(add, payload.forms);
      if(id){
        yield call(addAddress,{projectId:id,data:payload.address})
        yield call(addTimeSlot,{projectId:id,data:payload.timeSlot})
        yield put(routerRedux.push('/project/list'));
      }
    },
    *showModal({ payload }, { put }) {
      yield put({
        type: 'toggleMap',
        payload: payload,
      });
    },
    *addProjectAddress({ payload }, { put} ){
      yield put({
        type: 'saveAddress',
        payload: payload,
      });
    },
    *removeAddress({ payload }, { put,call}){
      if(payload.id){
        yield call(deleteProjectAddress,payload.id)
      }
      yield put({
        type: 'saveAddress',
        payload: payload.data,
      });
    },
    *updateProjectAddress({ payload }, { put} ){

    },
    *addProjectTimeSlot({ payload }, { put} ){
      yield put({
        type: 'saveTimeSlot',
        payload: payload,
      });
    },
    *removeProjectTimeSlot({ payload }, { put,call} ){
     if(payload.id){
      yield call(deleteProjectTimeSlot,payload.id)
     }
      yield put({
        type: 'saveTimeSlot',
        payload: payload.data,
      });
    },
    *updateProjectTimeSlot({ payload }, { put} ){

    },
    *projectAddressFormStatus({ payload }, { put} ){
      yield put({
        type: 'projectAddressFormStatus',
        payload: payload,
      });
    },
    *routeToUserMatch({ payload }, {put }) {
      yield put({type:'saveProjectDetail',payload})
      yield put(routerRedux.push({ pathname: `/project/userMatch/${payload.Id}`, params: payload}));
    },
    *loadProjectAddress({payload},{put,call}){
      const responst = yield call(loadProjectAddress,payload.projectId)
      yield put({
        type: 'saveAddress',
        payload: responst,
      });
    },
    *loadProjectTimeSlot({payload},{put,call}){
      const responst = yield call(loadProjectTimeSlot,payload.projectId)
      yield put({
        type: 'saveTimeSlot',
        payload: responst,
      });
    },
    *fetchMatchUser({ payload }, { call, put }) {
      const response = yield call(queryMatchUser, payload);
      yield put({
        type: 'saveMatchUser',
        payload: response,
      });
    },
    *matchUser({payload,callback},{call,put}){
      yield call(matchUser,payload)
      callback()
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    toggleMap(state, action) {
      return {
        ...state,
        showModal: action.payload,
      };
    },
    saveAddress(state,action){
      return {
        ...state,
        projectAddress: action.payload
      }
    },
    saveTimeSlot(state,action){
      return {
        ...state,
        projectTimeSlot: action.payload
      }
    },
    projectAddressFormStatus(state,action){
      return {
        ...state,
        projectAddressFormStatus: action.payload
      }
    },
    saveMatchUser(state,action){
      return {
        ...state,
        matchUser: action.payload
      }
    },
    saveProjectDetail(state,action){
      return {
        ...state,
        projectDetail: action.payload
      }
    }
  },
};
