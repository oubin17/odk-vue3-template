import './styles/index.scss'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import AppIcon from './components/icons/AppIcon.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
//注册全局图标库
app.component('AppIcon', AppIcon)
app.use(pinia)
app.use(router)

app.mount('#app')
