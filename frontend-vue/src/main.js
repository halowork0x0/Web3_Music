import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import VueLazyload from 'vue-lazyload'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(VueLazyload,{
  preload: 1.3,
  attempt: 1
})
app.mount('#app')
// createApp(App).mount('#app')
