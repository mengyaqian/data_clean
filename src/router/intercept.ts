//路由拦截
import VueRouter, { Route } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css' //这个样式必须引

NProgress.configure({
  showSpinner: false,
});

export default (router: VueRouter) => {
  router.beforeEach(async (to: Route, from: Route, next: Function) => {//使用async的原因：后续可以配合await使用
    NProgress.start();
     if(to.path === '/'){
      NProgress.done();
       next('/home')
     }else{
       NProgress.done();
       next()
     }
  });

  router.afterEach(() => {
    NProgress.done();
  });
};
