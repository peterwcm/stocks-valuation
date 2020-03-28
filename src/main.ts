import Vue from 'vue';
import App from './App.vue';
import Buefy from 'buefy';
import VueMoment from 'vue-moment';
import router from './router';

Vue.use(Buefy, {
  defaultIconPack: 'fas'
});
Vue.use(VueMoment);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
