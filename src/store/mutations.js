import * as types from './types'

const mutations = {
	[types.LOGIN]: (state, data) => {
		localStorage.setItem('token', data);
		// localStorage.token = data
		state.token = data
	},
	[types.LOGOUT]: (state) => {
		localStorage.removeItem('token');
		state.token = null
	},
	[types.USERNAME]: (state, data) => {
		localStorage.setItem('username', data);
		state.username = data
	},
	[types.SET_USER_INFO]: (state, userInfo) => {
		state.userInfo = userInfo
	}
};

export default mutations
