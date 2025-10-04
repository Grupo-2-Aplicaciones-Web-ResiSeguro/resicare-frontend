import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { setupPrimeVue } from '@/shared-kernel/infrastructure/ui-framework/primevue'
import i18n from '@/shared-kernel/infrastructure/i18n/i18n.js'
import router from '@/shared-kernel/infrastructure/router/router.js'

const app = createApp(App)

setupPrimeVue(app, 'lara')
app.use(i18n)
app.use(router)
app.mount('#app')
