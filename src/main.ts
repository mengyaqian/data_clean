import '@/router/class-component-hooks';
import Vue from 'vue'
import 'normalize.css';
import '@/assets/style/common.css';

import App from './App.vue'
import router from './router'
import store from './store/store'
import './registerServiceWorker'
import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')