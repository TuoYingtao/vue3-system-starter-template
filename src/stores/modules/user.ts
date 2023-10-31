import { login } from '@/api/login'
import defAva from '@/assets/images/profile.jpg'
import { CookiesUtils } from "@/utils/request/utils/Cookies";
import { RequestHooks } from "@/hooks";

const useRequest = RequestHooks();

const useUserStore = defineStore('user', {
  state: () => ({
    token: CookiesUtils.get(),
    name: '',
    avatar: '',
    roles: [] as string[],
    permissions: []
  } as User),
  actions: {
    // 登录
    login(userInfo: Record<string, any>) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then((res: Record<string, any>) => {
          CookiesUtils.getCooliesUtilsInstance().set({ value: res.token })
          this.token = res.token
          resolve(res)
        }).catch((error: Error) => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise(async (resolve, reject) => {
        const info: Record<string, any> = {
          name: '游客登录',
          avatar: '@/assets/images/kdy.jpg',
          roles: ['ROLE_DEFAULT'],
          permissions: [],
        };
        if (true) {
          await useRequest.getInfoFun(function (res: Record<string, any>) {
            const user = res.user
            const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              info.roles.push(...res.roles);
              info.permissions = res.permissions
            }
            info.name = user.userName
            info.avatar = avatar;
            resolve(info)
          }, function (error: Error) {
            reject(error);
          });
        }
        this.name = info.name;
        this.avatar = info.avatar;
        this.roles = info.roles;
        this.permissions = info.permissions;
        resolve(info)
      })
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        const that = this;
        useRequest.logOutFun(this.token, function () {
          that.token = ''
          that.roles = []
          that.permissions = []
          CookiesUtils.getCooliesUtilsInstance().remove();
          resolve(true)
        }, function (error: Error) {
          reject(error)
        });
      })
    }
  }
})

export default useUserStore
