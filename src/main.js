import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import VueInit from '@/assets/dev_config/vue_init';
import VueUtil from '@/assets/dev_config/vue_util';
import vcharts from 'v-charts'
import dataV from '@jiaminghi/data-view'


Vue.config.productionTip = false

VueInit();
VueUtil();
Vue.use(vcharts)
Vue.use(dataV)
Vue.prototype.axios = axios; // 挂载axios到vue.proto对象上原型属性

axios.interceptors.request.use(config => {
//在发送请求之前做些什么
return config;
},error => {
// Do something with request error
return Promise.reject(error);
});

axios.interceptors.response.use(response => {
// Do something before response is sent
return response;
},error => {
// Do something with response error
return Promise.reject(error);
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
