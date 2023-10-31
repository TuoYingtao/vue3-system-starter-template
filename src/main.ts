import 'virtual:svg-icons-register';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'element-plus/dist/index.css';
import '@/assets/styles/index.scss';

import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import stores from "./stores";
import directive from './directive';
import plugins from './plugins';
import './permission'; // permission control

import { useVueViewer } from "@/components/framework/VueViewer";
import elementIcons from '@/components/framework/SvgIcon/svgIcon.js';

import { download } from '@/utils/request';
import { useDict } from '@/utils/dict';
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels, HTMLTitle } from '@/utils';

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
app.config.globalProperties.HTMLTitle = HTMLTitle

// 全局组件挂载
useVueViewer(app);

app.use(router);
app.use(stores);
app.use(directive);
app.use(plugins);
app.use(elementIcons)

app.mount('#app');
