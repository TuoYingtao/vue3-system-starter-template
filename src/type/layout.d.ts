/** 侧边栏配置 */
declare type Sidebar = {
  /** 侧边栏状态 */
  opened: boolean,
  /** 动画效果 */
  withoutAnimation: boolean,
  /** 隐藏状态 */
  hide: boolean,
}

/** 应用程序 */
declare type App = {
  /** 侧边栏配置 */
  sidebar: Sidebar,
  /** 设备名称 */
  device: string,
  /** 全局样式大小 */
  size: string,
}

/** 框架系统设置 */
declare type Settings = {
  /** 网页标题 */
  title: string,
  /** 主题颜色 默认：#409EFF */
  theme: string,
  /** 侧边栏主题 深色主题theme-dark，浅色主题theme-light 默认：深色主题 */
  sideTheme: string,
  /** 是否系统布局配置 */
  showSettings: boolean,
  /** 顶部导航栏状态 */
  topNav: boolean,
  /** 标签状态 */
  tagsView: boolean,
  /** 固定头部状态 */
  fixedHeader: boolean,
  /** 侧边栏LOGO状态 */
  sidebarLogo: boolean,
  /** 动态标题 */
  dynamicTitle: string,
  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog?: string,
  [settingsName: string]: any
}
