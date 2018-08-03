// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
// import ElementUI from 'element-ui-verify';
// import ElementUIVerify from 'element-ui-verify';
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios';
// import axios from './axios'
import store from './store/index.js'

import VueQuillEditor from 'vue-quill-editor';

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(ElementUI);
// Vue.use(ElementUIVerify);
Vue.prototype.axios = axios;
Vue.use(VueQuillEditor);

/* eslint-disable no-new */
new Vue({
		axios,
		store,
		router,
		render: h => h(App)
	})
	.$mount('#app');
