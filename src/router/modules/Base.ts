import Layout from '@/layout/index.vue';
import { ROLE_DEFAULT } from "@/config/global";

// 静态路由
export default [
  {
    path: '/generator',
    component: Layout,
    name: 'Generator',
    redirect: 'noRedirect',
    meta: { title: '代码生成器', icon: 'code', noCache: true },
    roles: [ROLE_DEFAULT],
    hidden: false,
    alwaysShow: true,
    children: [
      {
        path: 'baseClass',
        component: () => import('@/views/generator/baseClass/index.vue'),
        name: 'BaseClass',
        meta: { title: '基类管理', icon: 'class', noCache: true, affix: false },
        hidden: false,
      }
    ]
  },
] as LayoutRoutes[]
