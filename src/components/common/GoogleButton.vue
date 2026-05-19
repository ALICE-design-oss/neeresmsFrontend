<template>
  <button
    type="button"
    @click="handleGoogleLogin"
    :disabled="loading"
    class="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg
      v-if="!loading"
      class="h-5 w-5 mr-2"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
      </g>
    </svg>
    <Loader v-else size="sm" class="mr-2" />
    {{ loading ? 'Chargement...' : text }}
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useToast } from 'vue-toastification';
import Loader from './Loader.vue';

const props = defineProps({
  text: {
    type: String,
    default: 'Continuer avec Google'
  },
  mode: {
    type: String,
    default: 'login', // 'login' ou 'register'
    validator: (value) => ['login', 'register'].includes(value)
  }
});

const emit = defineEmits(['success', 'error']);

const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);

const handleGoogleLogin = async () => {
  loading.value = true;
  
  try {
    // Appel vers l'API backend pour l'authentification Google
    // Le backend retournera l'URL de redirection Google ou directement l'utilisateur
    const endpoint = props.mode === 'login' ? '/auth/google/login' : '/auth/google/register';
    
    // Simulation d'appel API (à remplacer par l'appel réel quand le backend est prêt)
    // const response = await api.get(endpoint);
    // window.location.href = response.data.redirect_url;
    
    // Pour le moment, simulation d'une redirection vers le dashboard après connexion Google
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulation d'un utilisateur connecté via Google
    const googleUser = {
      id: 'google_' + Date.now(),
      name: 'Utilisateur Google',
      email: 'user@gmail.com',
      provider: 'google',
      wallet_balance: 1000
    };
    
    authStore.token = 'google_token_' + Date.now();
    authStore.user = googleUser;
    localStorage.setItem('token', authStore.token);
    localStorage.setItem('user', JSON.stringify(googleUser));
    
    toast.success(`Connexion avec Google réussie !`);
    emit('success', googleUser);
    
    // Redirection vers le dashboard
    window.location.href = '/dashboard';
    
  } catch (error) {
    console.error('Google auth error:', error);
    toast.error(error.response?.data?.message || 'Erreur de connexion Google');
    emit('error', error);
  } finally {
    loading.value = false;
  }
};
</script>