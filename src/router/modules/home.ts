import { RouteConfig } from 'vue-router'
const routers: RouteConfig[] = [
  {
        path: '/home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
        meta: {
          title: '首页',
          permission: true,
        },
    }
]
export default routers