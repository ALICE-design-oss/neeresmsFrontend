import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

const routes = [
  // Landing page
  {
    path: '/',
    name: 'Landing',
    component: () => import('../pages/Landing.vue'),
    meta: { public: true }
  },
  
  // Auth
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/auth/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/auth/Register.vue'),
    meta: { guest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../pages/auth/ForgotPassword.vue'),
    meta: { guest: true }
  },
  
  // Pricing
  {
    path: '/pricing',
    name: 'Pricing',
    component: () => import('../pages/Pricing.vue'),
    meta: { public: true }
  },
  
  // Payment status
  {
    path: '/payment/status',
    name: 'PaymentStatus',
    component: () => import('../components/wallet/PaymentStatus.vue'),
    meta: { guest: true }
  },
  
  // Dashboard
  {
    path: '/dashboard',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: () => import('../pages/dashboard/Home.vue') },
      { path: 'profile', name: 'Profile', component: () => import('../pages/dashboard/Profile.vue') },
      { path: 'settings', name: 'Settings', component: () => import('../pages/dashboard/Settings.vue') },
    ],
  },
  
  // SMS - Route unique
  {
    path: '/sms/send',
    name: 'SendSms',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'SendSmsPage', component: () => import('../components/sms/SendSms.vue') },
    ],
  },
  {
    path: '/sms/bulk',
    name: 'BulkSms',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'BulkSmsPage', component: () => import('../components/sms/BulkSms.vue') },
    ],
  },
  
  // Campagnes
  {
    path: '/campaigns',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Campaigns', component: () => import('../components/campaigns/Index.vue') },
      { path: ':id', name: 'CampaignDetails', component: () => import('../components/campaigns/Details.vue') },
      { path: 'new', name: 'NewCampaign', component: () => import('../components/campaigns/Form.vue') },
    ],
  },
  
  // Rapports
  {
    path: '/reports',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Reports', component: () => import('../pages/reports/Index.vue') },
    ],
  },
  
  // Wallet
  {
    path: '/wallet',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Wallet', component: () => import('../components/wallet/Index.vue') },
      { path: 'packs', name: 'WalletPacks', component: () => import('../components/wallet/Packs.vue') },
    ],
  },
  
  // API
  {
    path: '/api',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'ApiDocs', component: () => import('../pages/api/Index.vue') },
      { path: 'logs', name: 'ApiLogs', component: () => import('../pages/api/Logs.vue') },
    ],
  },
  
  // Revendeur
  {
    path: '/reseller',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Reseller', component: () => import('../pages/reseller/Index.vue') },
      { path: 'apply', name: 'ResellerApply', component: () => import('../pages/reseller/Apply.vue') },
    ],
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isGuest = to.matched.some(record => record.meta.guest);
  const isPublic = to.matched.some(record => record.meta.public);
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (isGuest && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;