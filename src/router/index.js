import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Calender from '@/pages/Calender.vue';
import Main from '@/pages/Main.vue';
import Setting from '@/pages/Setting.vue';
import Modification from '@/pages/Modification.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
    },
    {
      path: '/calender',
      name: 'calender',
      component: Calender,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/modification',
      name: 'modification',
      component: Modification,
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting,
    },
  ],
});

export default router;
