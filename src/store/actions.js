// import api from '../axios'
// import Vue from 'vue'
// import router from '../router/index'
import * as types from './types';

// export default {
// 	UserLogin({ commit }, data) {
// 		commit(types.LOGIN, data)
// 	},
//
// 	UserLogout({ commit }) {
// 		commit(types.LOGOUT)
// 	},
//
// 	UserName({ commit }, data) {
// 		commit(types.USERNAME, data)
// 	},
// 	setUserInfo({ commit }, userInfo) {
// 		commit(types.SET_USER_INFO, userInfo);
// 	}
// }
export const setUserInfo = function ({commit, state}, userInfo) {
  commit(types.SET_USER_INFO, userInfo);
};
