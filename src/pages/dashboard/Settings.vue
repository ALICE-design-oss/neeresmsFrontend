<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Paramètres</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Menu latéral -->
      <div class="lg:col-span-1">
        <div class="card">
          <div class="card-body p-0">
            <nav class="space-y-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="w-full flex items-center px-4 py-3 text-sm font-medium transition-colors"
                :class="[
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                ]"
              >
                <component :is="tab.icon" class="h-5 w-5 mr-3" />
                {{ tab.name }}
              </button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Contenu -->
      <div class="lg:col-span-3">
        <!-- Général -->
        <div v-if="activeTab === 'general'" class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Préférences générales</h3>
          </div>
          <div class="card-body space-y-6">
            <div>
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700">Notifications par email</span>
                <input
                  type="checkbox"
                  v-model="preferences.email_notifications"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </label>
            </div>

            <div>
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700">Notifications SMS de livraison</span>
                <input
                  type="checkbox"
                  v-model="preferences.sms_notifications"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </label>
            </div>

            <div>
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700">Rapports hebdomadaires par email</span>
                <input
                  type="checkbox"
                  v-model="preferences.weekly_reports"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </label>
            </div>

            <div class="pt-4">
              <button @click="savePreferences" :disabled="loading" class="btn-primary">
                <Loader v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
                Sauvegarder les préférences
              </button>
            </div>
          </div>
        </div>

        <!-- Sécurité -->
        <div v-if="activeTab === 'security'" class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Sécurité</h3>
          </div>
          <div class="card-body space-y-6">
            <div>
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700">Authentification à deux facteurs (2FA)</span>
                <button
                  @click="setup2FA"
                  class="text-sm text-primary-600 hover:text-primary-500"
                >
                  Configurer
                </button>
              </label>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Sessions actives</h4>
              <div class="space-y-3">
                <div v-for="session in sessions" :key="session.id" class="flex justify-between items-center">
                  <div>
                    <p class="text-sm text-gray-900">{{ session.device }}</p>
                    <p class="text-xs text-gray-500">{{ session.location }} • {{ session.last_active }}</p>
                  </div>
                  <button @click="revokeSession(session.id)" class="text-red-600 hover:text-red-700 text-sm">
                    Révoquer
                  </button>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <button @click="logoutAllDevices" class="text-red-600 hover:text-red-700 text-sm">
                Déconnecter de tous les appareils
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div v-if="activeTab === 'notifications'" class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          <div class="card-body space-y-6">
            <div>
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700">Envoi de SMS réussi</span>
                <input
                  type="checkbox"
                  v-model="notifications.sms_success"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </label>
            </div>

            <div>
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700">Échec d'envoi de SMS</span>
                <input
                  type="checkbox"
                  v-model="notifications.sms_failed"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </label>
            </div>

            <div>
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700">Solde faible (moins de 5000 FCFA)</span>
                <input
                  type="checkbox"
                  v-model="notifications.low_balance"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </label>
            </div>

            <div>
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700">Nouvelle campagne créée</span>
                <input
                  type="checkbox"
                  v-model="notifications.new_campaign"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </label>
            </div>

            <div class="pt-4">
              <button @click="saveNotifications" :disabled="loading" class="btn-primary">
                <Loader v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon
} from '@heroicons/vue/24/outline';
import Loader from '../../components/common/Loader.vue';

const toast = useToast();
const loading = ref(false);
const activeTab = ref('general');

const tabs = [
  { id: 'general', name: 'Général', icon: Cog6ToothIcon },
  { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon }
];

const preferences = reactive({
  email_notifications: true,
  sms_notifications: false,
  weekly_reports: true
});

const notifications = reactive({
  sms_success: true,
  sms_failed: true,
  low_balance: true,
  new_campaign: false
});

const sessions = ref([
  {
    id: 1,
    device: 'Chrome sur Windows',
    location: 'Abidjan, Côte d\'Ivoire',
    last_active: 'Il y a 2 heures'
  },
  {
    id: 2,
    device: 'Safari sur iPhone',
    location: 'Abidjan, Côte d\'Ivoire',
    last_active: 'Il y a 1 jour'
  }
]);

const savePreferences = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Préférences sauvegardées');
  } catch (error) {
    toast.error('Erreur lors de la sauvegarde');
  } finally {
    loading.value = false;
  }
};

const saveNotifications = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Préférences de notification sauvegardées');
  } catch (error) {
    toast.error('Erreur lors de la sauvegarde');
  } finally {
    loading.value = false;
  }
};

const setup2FA = () => {
  toast.info('Configuration 2FA à venir');
};

const revokeSession = (id) => {
  sessions.value = sessions.value.filter(s => s.id !== id);
  toast.success('Session révoquée');
};

const logoutAllDevices = () => {
  toast.info('Déconnexion de tous les appareils...');
};
</script>