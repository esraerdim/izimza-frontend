import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './app/styles/global.css'
import AppRoot from './app/AppRoot.vue'
import { router } from './app/providers'

const app = createApp(AppRoot)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
