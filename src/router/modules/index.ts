import { RouteConfig } from 'vue-router';

import Layout from '@/layout';
import homeRouters from './home'
import projectRouters from './project'
import otherRouters from './other'

const routes: RouteConfig[] = [
    {
        path: '/layout',
        name:'layout',
        redirect: '/home',
        component: Layout,
        children: [
            ...homeRouters,
            ...projectRouters
        ]
    },
    ...otherRouters
]


export default routes