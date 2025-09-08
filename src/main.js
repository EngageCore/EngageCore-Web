import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import LuckyCanvas from '@lucky-canvas/vue'

// css
import '@/assets/css/bootstrap.min.css'
import '@/assets/css/styles.min.css'
import '@/assets/css/simplebar.css'
import '@/assets/css/custom-style.css'
import "tiny-slider/dist/tiny-slider.css"

// js
import '@/assets/js/svg-loader.js'

// 创建Vue应用实例
const app = createApp(App)
const pinia = createPinia()

// 使用插件
app.use(pinia)
app.use(router)
app.use(LuckyCanvas)

// 挂载应用
app.mount('#app')
