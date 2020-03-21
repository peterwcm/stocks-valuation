import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import router from './router'

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
