import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    name: '',
    avatar: '',
    roles: [] as string[],
    permissions: []
  }),
  actions: {
    // 登录
    login(userInfo: Record<string, any>) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then((res: Record<string, any>) => {
          setToken(res.token)
          this.token = res.token
          resolve(res)
        }).catch((error: Error) => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo().then((res: Record<string, any>) => {
          const user = res.user
          const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;

          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            this.roles = res.roles
            this.permissions = res.permissions
          } else {
            this.roles = ['ROLE_DEFAULT']
          }
          this.name = user.userName
          this.avatar = avatar;
          resolve(res)
        }).catch((error: Error) => {
          reject(error)
        })
      })
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token).then(() => {
          this.token = ''
          this.roles = []
          this.permissions = []
          removeToken()
          resolve(true)
        }).catch((error: Error) => {
          reject(error)
        })
      })
    }
  }
})

export default useUserStore
