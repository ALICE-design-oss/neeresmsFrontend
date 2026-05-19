import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './assets/main.css';
import VueApexCharts from 'vue3-apexcharts';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './store/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
});
app.component('apexchart', VueApexCharts);

// Initialiser l'auth store
const authStore = useAuthStore();
authStore.initFromStorage();

app.mount('#app');