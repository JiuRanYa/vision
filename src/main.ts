import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { router } from '@/router'
import App from './App.vue'
import { ApiService } from './service/fetch'
import './style.css'

const app = createApp(App)

ApiService.init()
app.use(createPinia())
app.use(router)
app.mount('#app')
