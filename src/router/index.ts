import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/stocks',
    name: 'Stocks',
    component: () => import(/* webpackChunkName: "stocks" */ '@/views/Stocks.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
