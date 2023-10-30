import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 自动导入modules文件夹下所有ts文件
const modules: Record<string, any> = import.meta.glob('./modules/**/*.ts', { eager: true });

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes: LayoutRoutes[] = [];

export const constantRoutes: LayoutRoutes[] = [];

export const baseRoutes: LayoutRoutes[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  if (key === './modules/Base.ts') {
    baseRoutes.push(...modList);
  } else if (key === './modules/Dynamic.ts') {
    dynamicRoutes.push(...modList);
  } else {
    constantRoutes.push(...modList);
  }
});

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: constantRoutes as RouteRecordRaw[],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {top: 0}
    }
  },
})

export default router
