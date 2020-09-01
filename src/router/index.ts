import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './modules';
import routerIntercept from './intercept';

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  base: '/',
  routes
})
routerIntercept(router);//路由拦截

export default router
