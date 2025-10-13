import { install } from 'panda-ui'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { router } from '@/router'
import App from './App.vue'
import './style.css'
import 'panda-ui/css/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(install)
app.mount('#app')
