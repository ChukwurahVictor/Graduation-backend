import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 在控制台告诉我们修改过的mutation是什么
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

// Vuex调试工具 检测对state的修改是否是通过mutations修改
const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})