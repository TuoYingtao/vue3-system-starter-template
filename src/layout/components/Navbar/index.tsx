import { defineComponent } from "vue";
import { ElDropdown, ElDropdownMenu, ElIcon, ElMessageBox, ElTooltip } from 'element-plus'

import useAppStore from '@/stores/modules/app'
import useUserStore from '@/stores/modules/user'
import useSettingsStore from '@/stores/modules/settings'

import './index.scss';
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import TopNav from '@/components/TopNav/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import HeaderSearch from '@/components/HeaderSearch/index.vue'
import RuoYiGit from '@/components/RuoYi/Git/index.vue'
import RuoYiDoc from '@/components/RuoYi/Doc/index.vue'

export default defineComponent({
  name: 'Navbar',
  setup(props, { emit }) {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const settingsStore = useSettingsStore()

    function toggleSideBar() {
      appStore.toggleSideBar(false)
    }

    function handleCommand(command: string) {
      switch (command) {
        case "setLayout":
          setLayout();
          break;
        case "logout":
          logout();
          break;
        default:
          break;
      }
    }

    function logout() {
      ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userStore.logOut().then(() => {
          location.href = '/index';
        })
      }).catch(() => { });
    }

    function setLayout() {
      return emit('setLayout');
    }

    emit('setLayout')

    const renderIcon = () => <ElIcon><caret-bottom /></ElIcon>

    const renderTooltip = (content: string, slots: JSX.Element) => <ElTooltip content={content} effect="dark" placement="bottom" v-slots={{
      default: slots
    }} />

    const renderDropdownMenu = (slots: JSX.Element) => <ElDropdownMenu v-slots={{
      default: slots
    }} />

    const renderDropdown = () => <ElDropdown class="right-menu-item hover-effect" trigger="click" onCommand={handleCommand} v-slots={{
      default: (<>
        <div class="avatar-wrapper">
          <img class="user-avatar" src={userStore.avatar} />
          {renderIcon()}
        </div>
      </>),
      dropdown: renderDropdownMenu((<>
        <router-link to="/user/profile">
          <el-dropdown-item>个人中心</el-dropdown-item>
        </router-link>
        {settingsStore.showSettings && (<>
          <el-dropdown-item command="setLayout">
            <span>布局设置</span>
          </el-dropdown-item>
        </>)}
        <el-dropdown-item divided command="logout">
          <span>退出登录</span>
        </el-dropdown-item>
      </>))
    }} />

    return {
      settingsStore,
      appStore,
      toggleSideBar,
      renderTooltip,
      renderDropdown,
    }
  },
  render() {
    return (<div class="navbar">
      <Hamburger id="hamburger-container" class="hamburger-container" isActive={this.appStore.sidebar.opened} onToggleClick={this.toggleSideBar} />
      {!this.settingsStore.topNav && <Breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>}
      {this.settingsStore.topNav && <TopNav id="topmenu-container" class="topmenu-container"/>}
      <div class="right-menu">
        {this.appStore.device !== 'mobile' && (<>
          <HeaderSearch id="header-search" class="right-menu-item" />
          { this.renderTooltip('源码地址', (<RuoYiGit id="ruoyi-git" class="right-menu-item hover-effect" />)) }
          { this.renderTooltip('文档地址', (<RuoYiDoc id="ruoyi-doc" class="right-menu-item hover-effect" />)) }
          <Screenfull id="screenfull" class="right-menu-item hover-effect" />
          { this.renderTooltip('布局大小', (<SizeSelect id="size-select" class="right-menu-item hover-effect" />)) }
        </>)}
        <div class="avatar-container">
          {this.renderDropdown()}
        </div>
      </div>
    </div>)
  }
})
