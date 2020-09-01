import { RouteConfig } from 'vue-router'
const routers: RouteConfig[] = [
  {
        path: '/list',
        name: 'list',
        component: () => import(/* webpackChunkName: "list" */ '@/views/project/list.vue'),
        meta: {
          title: '项目列表',
          permission: true,
        },
    },
    {
        path: '/creat/:uuid',
        name: 'creat',
        component: () => import(/* webpackChunkName: "creat" */ '@/views/project/creat.vue'),
        meta: {
          title: '创建项目',
          permission: true,
        },
    },
    {
        path: '/result',
        name: 'result',
        component: () => import(/* webpackChunkName: "result" */ '@/views/project/result.vue'),
        meta: {
          title: '清洗结果',
          permission: true,
        },
    }
]
export default routers