import router from './router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { isHttp } from '@/utils/validate'
import useUserStore from '@/stores/modules/user'
import useSettingsStore from '@/stores/modules/settings'
import usePermissionStore from '@/stores/modules/permission'
import { RouteRecordRaw } from "vue-router";
import { CookiesUtils } from "@/utils/request/utils/Cookies";
import { IS_TOKEN_AUTH } from "@/config/global";

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/register'];

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (CookiesUtils.get()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title as string)
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (useUserStore().roles.length === 1) {
        try { // 判断当前用户是否已拉取完user_info信息
          let roles: string[] = useUserStore().roles;
          let cd: any = null;
          if (IS_TOKEN_AUTH) {
            const info: any = await useUserStore().getInfo();
            roles = info.roles;
            cd = { ...to, replace: true };
          }
          // TODO 静态路由 页面刷新丢失Store问题
          usePermissionStore().generateRoutes(roles).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            accessRoutes.forEach(route => {
              if (!isHttp(route.path)) {
                router.addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
              }
            })
            next(cd) // hack方法 确保addRoutes已完成
          })
        } catch (err: any) {
          useUserStore().logOut().then(() => {
            ElMessage.error(err)
            next({path: '/'})
          })
        }
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
