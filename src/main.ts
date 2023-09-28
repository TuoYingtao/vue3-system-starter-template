import 'virtual:svg-icons-register';
import 'element-plus/dist/index.css'
import '@/assets/styles/index.scss'

import { createApp } from 'vue';
import Cookies from 'js-cookie';

import App from './App.vue';
import router from './router';
import stores from "./stores";
import directive from './directive';
import plugins from './plugins';
import './permission' // permission control

import ElementPlus from 'element-plus';
import locale from "element-plus/es/locale/lang/zh-cn"; // 中文语言
import { useVueViewer } from "@/components/framework/VueViewer";
import elementIcons from '@/components/framework/SvgIcon/svgIcon.js'

import { download } from '@/utils/request'
import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'

const app = createApp(App);

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

// 全局组件挂载
useVueViewer(app);

app.use(router);
app.use(stores);
app.use(directive);
app.use(plugins);
// 注册element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  size: "default"
});
app.use(elementIcons)

app.mount('#app');
