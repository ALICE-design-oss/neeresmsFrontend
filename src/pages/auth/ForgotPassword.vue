<!--
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="h-12 w-12 bg-primary-600 rounded flex items-center justify-center">
          <span class="text-white font-bold text-xl">NS</span>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Mot de passe oublié
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ou
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          retour à la connexion
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="!emailSent" class="space-y-6">
          <p class="text-sm text-gray-600">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
          
          <form @submit.prevent="handleSubmit">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :class="{ 'border-red-500': error }"
                />
                <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
              </div>
            </div>

            <div class="mt-6">
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
                {{ loading ? 'Envoi en cours...' : 'Envoyer le lien' }}
              </button>
            </div>
          </form>
        </div>

        <div v-else class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <EnvelopeIcon class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Email envoyé !</h3>
          <p class="mt-2 text-sm text-gray-600">
            Nous avons envoyé un lien de réinitialisation à <strong>{{ email }}</strong>.<br>
            Veuillez vérifier votre boîte de réception.
          </p>
          <button
            @click="resend"
            class="mt-4 text-sm text-primary-600 hover:text-primary-500"
          >
            Renvoyer l'email
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { authService } from '../../services/auth';
import Loader from '../../components/common/Loader.vue';
import { EnvelopeIcon } from '@heroicons/vue/24/outline';

const toast = useToast();
const email = ref('');
const loading = ref(false);
const error = ref('');
const emailSent = ref(false);

const handleSubmit = async () => {
  if (!email.value) {
    error.value = 'L\'email est requis';
    return;
  }
  
  if (!/\S+@\S+\.\S+/.test(email.value)) {
    error.value = 'Email invalide';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    await authService.forgotPassword(email.value);
    emailSent.value = true;
    toast.success('Email de réinitialisation envoyé !');
  } catch (err) {
    error.value = err.response?.data?.message || 'Une erreur est survenue';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

const resend = () => {
  emailSent.value = false;
  error.value = '';
};
</script>

-->

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="h-12 w-12 bg-primary-600 rounded flex items-center justify-center">
          <span class="text-white font-bold text-xl">NS</span>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Mot de passe oublié
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ou
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          retour à la connexion
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="!emailSent" class="space-y-6">
          <p class="text-sm text-gray-600">
            Entrez votre adresse email.
          </p>
          
          <form @submit.prevent="handleSubmit" novalidate>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="email"
                  type="text"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="mt-6">
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {{ loading ? 'Envoi...' : 'Envoyer' }}
              </button>
            </div>
          </form>
        </div>

        <div v-else class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <EnvelopeIcon class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Email envoyé !</h3>
          <p class="mt-2 text-sm text-gray-600">
            Un email a été envoyé à <strong>{{ email }}</strong>.
          </p>
          <button
            @click="resend"
            class="mt-4 text-sm text-primary-600 hover:text-primary-500"
          >
            Renvoyer l'email
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { EnvelopeIcon } from '@heroicons/vue/24/outline';

const toast = useToast();
const email = ref('');
const loading = ref(false);
const emailSent = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  // Accepte toutes les données, pas de validation
  await new Promise(resolve => setTimeout(resolve, 1000));
  loading.value = false;
  emailSent.value = true;
  toast.success('Email envoyé !');
};

const resend = () => {
  emailSent.value = false;
};
</script>