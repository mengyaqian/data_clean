import { RouteConfig } from 'vue-router'
const routers: RouteConfig[] = [
  {
        path: '*',
        name: 'Page404',
        component: () => import(/* webpackChunkName: "404" */ '@/views/other/404.vue'),
        meta: {
          title: '404',
          permission: true,
        },
    }
]
export default routers