import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import MonitoringView from '@/views/MonitoringView.vue';
import LoginView from '@/views/authentication/LoginView.vue';
import SignInView from '@/views/authentication/SignInView.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/monitoring',
      name: 'monitoring',
      component: MonitoringView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView
    }
  ],
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  auth.initialize();
  const publicPages = ['/login', '/signin'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !auth.isAuthenticated) {
    return next('/login');
  }
  next();
});

export default router;
