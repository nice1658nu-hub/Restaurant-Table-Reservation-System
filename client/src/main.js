import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 1. นำเข้า Component Header ที่เราเปลี่ยนชื่อแล้ว
import Header from './components/Header.vue'

import './style.css'
import App from './App.vue'
import router from './router'

// (ลบการนำเข้า CkeditorPlugin ออกไป เพราะระบบจองโต๊ะเราไม่ได้ใช้พิมพ์ข้อความยาวๆ แล้ว)

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia) 
app.use(router)

// 2. ลงทะเบียน Component Header ในชื่อใหม่ (app-header แทน coffee-header)
app.component('app-header', Header)

app.mount('#app')