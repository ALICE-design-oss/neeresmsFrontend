<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="h-12 w-12 bg-primary-600 rounded flex items-center justify-center">
          <span class="text-white font-bold text-xl">NS</span>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Créer un compte
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ou
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          connectez-vous à votre compte existant
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nom complet -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="form.name"
                type="text"
                autocomplete="name"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
            </div>
          </div>

          <!-- Téléphone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Numéro de téléphone
            </label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                autocomplete="tel"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-500': errors.phone }"
                placeholder="+226 00 00 00 00"
              />
              <p v-if="errors.phone" class="mt-2 text-sm text-red-600">{{ errors.phone }}</p>
            </div>
          </div>

          <!-- Entreprise -->
          <div>
            <label for="company" class="block text-sm font-medium text-gray-700">
              Entreprise (optionnel)
            </label>
            <div class="mt-1">
              <input
                id="company"
                v-model="form.company"
                type="text"
                autocomplete="organization"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-500': errors.password }"
              />
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
            </div>
          </div>

          <!-- Confirmation mot de passe -->
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <div class="mt-1">
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-500': errors.password_confirmation }"
              />
              <p v-if="errors.password_confirmation" class="mt-2 text-sm text-red-600">{{ errors.password_confirmation }}</p>
            </div>
          </div>

          <!-- Conditions d'utilisation -->
          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.terms"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              J'accepte les
              <a href="#" class="text-primary-600 hover:text-primary-500">conditions d'utilisation</a>
              et la
              <a href="#" class="text-primary-600 hover:text-primary-500">politique de confidentialité</a>
            </label>
          </div>
          <p v-if="errors.terms" class="text-sm text-red-600">{{ errors.terms }}</p>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
              {{ loading ? 'Création en cours...' : 'Créer un compte' }}
            </button>
          </div>
        </form>

        <!-- Séparateur -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Ou continuer avec
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Google
            </button>
            <button
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import Loader from '../../components/common/Loader.vue';
import { useToast } from 'vue-toastification';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);

// Récupérer le paramètre de redirection
const redirectPath = ref(route.query.redirect || null);

const form = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  password: '',
  password_confirmation: '',
  terms: false
});

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  terms: ''
});

const validateForm = () => {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '');
  
  // Validation du nom
  if (!form.name.trim()) {
    errors.name = 'Le nom est requis';
    isValid = false;
  } else if (form.name.length < 2) {
    errors.name = 'Le nom doit contenir au moins 2 caractères';
    isValid = false;
  }
  
  // Validation de l'email
  if (!form.email) {
    errors.email = 'L\'email est requis';
    isValid = false;
  } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(form.email)) {
    errors.email = 'Email invalide';
    isValid = false;
  }
  
  // Validation du téléphone (optionnel mais format valide si fourni)
  if (form.phone && !/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{4,10}$/.test(form.phone)) {
    errors.phone = 'Numéro de téléphone invalide';
    isValid = false;
  }
  
  // Validation du mot de passe
  if (!form.password) {
    errors.password = 'Le mot de passe est requis';
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    isValid = false;
  } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(form.password)) {
    errors.password = 'Le mot de passe doit contenir au moins une majuscule et une minuscule';
    isValid = false;
  }
  
  // Validation de la confirmation
  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Les mots de passe ne correspondent pas';
    isValid = false;
  }
  
  // Validation des conditions
  if (!form.terms) {
    errors.terms = 'Vous devez accepter les conditions d\'utilisation';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  
  try {
    const userData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      password: form.password,
      password_confirmation: form.password_confirmation
    };
    
    await authStore.register(userData);
    toast.success('Compte créé avec succès !');
    
    // Rediriger vers la page demandée ou le login
    if (redirectPath.value === 'reseller') {
      router.push('/reseller/apply');
    } else {
      router.push('/login');
    }
  } catch (error) {
    console.error('Registration error:', error);
    // Les erreurs sont déjà gérées par le store
  } finally {
    loading.value = false;
  }
};
</script>