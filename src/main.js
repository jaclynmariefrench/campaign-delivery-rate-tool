import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.scss'

const app = createApp(App)

// Enable devtools explicitly
app.config.devtools = true

app.mount('#app')

