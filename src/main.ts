import 'virtual:svg-icons-register';
import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueViewer from 'v-viewer';

import App from './App.vue'
import router from './router'
import IMAGE_PREVIEW_OPTIONS from "@/config/ViewViewer";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueViewer, {
  defaultOptions: IMAGE_PREVIEW_OPTIONS
})

app.mount('#app')
