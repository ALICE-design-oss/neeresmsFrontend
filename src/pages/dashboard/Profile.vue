<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Mon profil</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Informations personnelles -->
      <div class="lg:col-span-2">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Informations personnelles</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <div class="mt-1">
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div class="mt-1">
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      disabled
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <div class="mt-1">
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label for="company" class="block text-sm font-medium text-gray-700">
                    Entreprise
                  </label>
                  <div class="mt-1">
                    <input
                      id="company"
                      v-model="form.company"
                      type="text"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button type="submit" :disabled="loading" class="btn-primary">
                  <Loader v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
                  {{ loading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Changement de mot de passe -->
        <div class="card mt-6">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Changer le mot de passe</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="changePassword" class="space-y-6">
              <div>
                <label for="current_password" class="block text-sm font-medium text-gray-700">
                  Mot de passe actuel
                </label>
                <div class="mt-1">
                  <input
                    id="current_password"
                    v-model="passwordForm.current_password"
                    type="password"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="new_password" class="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <div class="mt-1">
                  <input
                    id="new_password"
                    v-model="passwordForm.new_password"
                    type="password"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="confirm_password" class="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <div class="mt-1">
                  <input
                    id="confirm_password"
                    v-model="passwordForm.confirm_password"
                    type="password"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="flex justify-end">
                <button type="submit" :disabled="passwordLoading" class="btn-primary">
                  <Loader v-if="passwordLoading" class="w-5 h-5 mr-2 animate-spin" />
                  {{ passwordLoading ? 'Changement...' : 'Changer le mot de passe' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Statistiques et informations -->
      <div class="lg:col-span-1">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Statistiques</h3>
          </div>
          <div class="card-body space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Membre depuis</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(user?.created_at) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Total SMS envoyés</span>
              <span class="text-sm font-medium text-gray-900">{{ stats.total_sms || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Campagnes créées</span>
              <span class="text-sm font-medium text-gray-900">{{ stats.total_campaigns || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Taux de livraison</span>
              <span class="text-sm font-medium text-green-600">{{ stats.delivery_rate || 0 }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useUserStore } from '../../store/user';
import Loader from '../../components/common/Loader.vue';

const toast = useToast();
const userStore = useUserStore();

const loading = ref(false);
const passwordLoading = ref(false);
const user = ref(null);
const stats = ref({});

const form = reactive({
  name: '',
  email: '',
  phone: '',
  company: ''
});

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
});

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const updateProfile = async () => {
  loading.value = true;
  try {
    // Appel API à implémenter
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Profil mis à jour avec succès');
  } catch (error) {
    toast.error('Erreur lors de la mise à jour');
  } finally {
    loading.value = false;
  }
};

const changePassword = async () => {
  if (passwordForm.new_password !== passwordForm.confirm_password) {
    toast.error('Les mots de passe ne correspondent pas');
    return;
  }
  
  if (passwordForm.new_password.length < 6) {
    toast.error('Le mot de passe doit contenir au moins 6 caractères');
    return;
  }
  
  passwordLoading.value = true;
  try {
    // Appel API à implémenter
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Mot de passe changé avec succès');
    passwordForm.current_password = '';
    passwordForm.new_password = '';
    passwordForm.confirm_password = '';
  } catch (error) {
    toast.error('Erreur lors du changement de mot de passe');
  } finally {
    passwordLoading.value = false;
  }
};

const loadUserData = () => {
  user.value = userStore.user;
  if (user.value) {
    form.name = user.value.name || '';
    form.email = user.value.email || '';
    form.phone = user.value.phone || '';
    form.company = user.value.company || '';
  }
  
  // Données de test
  stats.value = {
    total_sms: 1245,
    total_campaigns: 12,
    delivery_rate: 98.3
  };
};

onMounted(() => {
  loadUserData();
});
</script>