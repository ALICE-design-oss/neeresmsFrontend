<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Programme Revendeur</h1>
        <p class="mt-1 text-sm text-gray-500">
          Gagnez des commissions en parrainant de nouveaux clients
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="shareReferralLink" class="btn-secondary">
          <ShareIcon class="h-5 w-5 mr-2" />
          Partager
        </button>
        <button @click="requestPayout" class="btn-primary">
          <CurrencyDollarIcon class="h-5 w-5 mr-2" />
          Demander un paiement
        </button>
      </div>
    </div>

    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Commissions totales</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatPrice(totalCommissions) }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CurrencyDollarIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Commissions en attente</p>
              <p class="text-2xl font-bold text-yellow-600">{{ formatPrice(pendingCommissions) }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Clients parrainés</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalClients }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <UsersIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Niveau actuel</p>
              <p class="text-2xl font-bold text-purple-600">{{ currentLevel }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <TrophyIcon class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lien de parrainage -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Votre lien de parrainage</h3>
      </div>
      <div class="card-body">
        <div class="flex flex-col sm:flex-row gap-3">
          <input
            :value="referralLink"
            readonly
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
          />
          <button @click="copyReferralLink" class="btn-secondary">
            <DocumentDuplicateIcon class="h-5 w-5 mr-2" />
            Copier
          </button>
        </div>
        <p class="mt-2 text-sm text-gray-500">
          Partagez ce lien avec vos clients. Chaque inscription vous rapportera une commission sur leurs recharges.
        </p>
      </div>
    </div>

    <!-- Niveaux de revendeur -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Niveaux et commissions</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="level in levels"
            :key="level.name"
            class="border-2 rounded-lg p-4 text-center transition-all"
            :class="[
              currentLevel === level.name
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200'
            ]"
          >
            <div class="text-3xl mb-2">{{ level.icon }}</div>
            <p class="text-lg font-bold text-gray-900">{{ level.name }}</p>
            <p class="text-2xl font-bold text-primary-600 mt-2">{{ level.commission }}%</p>
            <p class="text-xs text-gray-500 mt-1">de commission</p>
            <p class="text-xs text-gray-500 mt-2">Minimum: {{ formatPrice(level.minVolume) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Historique des commissions -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Historique des commissions</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Commission</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="commission in commissions" :key="commission.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(commission.created_at) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ commission.client_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ commission.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {{ formatPrice(commission.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                +{{ formatPrice(commission.commission) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="commission.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ commission.status === 'paid' ? 'Payé' : 'En attente' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :per-page="perPage"
        @page-change="loadCommissions"
      />
    </div>

    <!-- Clients parrainés -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Clients parrainés</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date d'inscription</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Volume total</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in clients" :key="client.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-sm font-medium">{{ client.name.charAt(0) }}</span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ client.name }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ client.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(client.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                {{ formatPrice(client.total_volume) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de demande de paiement -->
    <Modal
      :is-open="showPayoutModal"
      title="Demande de paiement"
      @close="showPayoutModal = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Montant disponible : <span class="font-bold">{{ formatPrice(pendingCommissions) }}</span>
        </p>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Montant à retirer
          </label>
          <div class="mt-1 relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">FCFA</span>
            <input
              v-model="payoutAmount"
              type="number"
              :max="pendingCommissions"
              class="pl-12 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Méthode de paiement
          </label>
          <select
            v-model="payoutMethod"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="orange_money">Orange Money</option>
            <option value="mtn_money">MTN Money</option>
            <option value="wave">Wave</option>
            <option value="bank">Virement bancaire</option>
          </select>
        </div>

        <div v-if="payoutMethod !== 'bank'">
          <label class="block text-sm font-medium text-gray-700">
            Numéro de téléphone
          </label>
          <input
            v-model="payoutPhone"
            type="text"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="+225 07 00 00 00"
          />
        </div>

        <div class="bg-yellow-50 rounded-lg p-3">
          <p class="text-xs text-yellow-800">
            ⚠️ Les paiements sont traités sous 48h ouvrées. Des frais de transaction peuvent s'appliquer selon la méthode choisie.
          </p>
        </div>
      </div>
      
      <template #actions>
        <button @click="showPayoutModal = false" class="btn-secondary">
          Annuler
        </button>
        <button
          @click="submitPayoutRequest"
          :disabled="!canRequestPayout"
          class="btn-primary"
        >
          Demander le paiement
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import {
  ShareIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UsersIcon,
  TrophyIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline';
import Modal from '../../components/common/Modal.vue';
import Pagination from '../../components/common/Pagination.vue';

const toast = useToast();

// États
const totalCommissions = ref(125000);
const pendingCommissions = ref(45000);
const totalClients = ref(12);
const currentLevel = ref('Silver');
const referralLink = ref('https://neeresms.io/ref/ABC123XYZ');
const commissions = ref([]);
const clients = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const perPage = ref(10);
const showPayoutModal = ref(false);
const payoutAmount = ref(0);
const payoutMethod = ref('orange_money');
const payoutPhone = ref('');

const levels = [
  { name: 'Bronze', commission: 5, minVolume: 0, icon: '🥉' },
  { name: 'Silver', commission: 10, minVolume: 100000, icon: '🥈' },
  { name: 'Gold', commission: 15, minVolume: 500000, icon: '🥇' }
];

const canRequestPayout = computed(() => {
  return payoutAmount.value > 0 && payoutAmount.value <= pendingCommissions.value && payoutMethod.value;
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price);
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const loadCommissions = async () => {
  // Données de test
  commissions.value = [
    {
      id: 1,
      client_name: 'Tech SARL',
      type: 'Rechargement',
      amount: 50000,
      commission: 5000,
      status: 'pending',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      client_name: 'Digital Solutions',
      type: 'Abonnement',
      amount: 25000,
      commission: 2500,
      status: 'paid',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3,
      client_name: 'Marketing Pro',
      type: 'Rechargement',
      amount: 100000,
      commission: 10000,
      status: 'pending',
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ];
  totalPages.value = 1;
  totalItems.value = 3;
};

const loadClients = async () => {
  // Données de test
  clients.value = [
    {
      id: 1,
      name: 'Tech SARL',
      email: 'contact@techsarl.com',
      created_at: new Date().toISOString(),
      total_volume: 150000
    },
    {
      id: 2,
      name: 'Digital Solutions',
      email: 'info@digitalsolutions.com',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      total_volume: 75000
    },
    {
      id: 3,
      name: 'Marketing Pro',
      email: 'contact@marketingpro.com',
      created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
      total_volume: 200000
    }
  ];
};

const copyReferralLink = () => {
  navigator.clipboard.writeText(referralLink.value);
  toast.success('Lien de parrainage copié');
};

const shareReferralLink = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Rejoignez NeereSMS',
      text: 'Inscrivez-vous avec mon lien de parrainage et bénéficiez de crédits SMS offerts !',
      url: referralLink.value
    });
  } else {
    copyReferralLink();
  }
};

const requestPayout = () => {
  if (pendingCommissions.value === 0) {
    toast.error('Aucune commission disponible');
    return;
  }
  payoutAmount.value = pendingCommissions.value;
  showPayoutModal.value = true;
};

const submitPayoutRequest = async () => {
  if (!canRequestPayout.value) return;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Demande de paiement envoyée avec succès');
    showPayoutModal.value = false;
    pendingCommissions.value -= payoutAmount.value;
  } catch (error) {
    toast.error('Erreur lors de la demande');
  }
};

onMounted(() => {
  loadCommissions();
  loadClients();
});
</script>