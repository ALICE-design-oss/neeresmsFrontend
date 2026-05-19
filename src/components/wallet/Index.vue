<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Wallet</h1>
        <p class="mt-1 text-sm text-gray-500">
          Gérez votre solde et vos transactions
        </p>
      </div>
      <div class="flex space-x-3">
        <router-link to="/wallet/packs" class="btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Recharger
        </router-link>
      </div>
    </div>

    <!-- Solde et statistiques -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <div class="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div class="card-body">
            <p class="text-sm opacity-90">Solde disponible</p>
            <p class="text-4xl font-bold mt-2">{{ formatPrice(balance) }}</p>
            <p class="text-sm opacity-75 mt-2">
              ~ {{ Math.floor(balance / 5) }} SMS disponibles
            </p>
            <div class="mt-4 pt-4 border-t border-white/20">
              <div class="flex justify-between text-sm">
                <span>Niveau</span>
                <span class="font-medium">{{ userTier }}</span>
              </div>
              <div class="flex justify-between text-sm mt-2">
                <span>Prix par SMS</span>
                <span class="font-medium">{{ formatPrice(smsPrice) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="grid grid-cols-2 gap-4">
          <div class="card">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">Total dépensé</p>
                  <p class="text-2xl font-bold text-gray-900">{{ formatPrice(totalSpent) }}</p>
                </div>
                <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <ArrowTrendingDownIcon class="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">SMS envoyés</p>
                  <p class="text-2xl font-bold text-gray-900">{{ formatNumber(totalSmsSent) }}</p>
                </div>
                <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <EnvelopeIcon class="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Onglets -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
          :class="[
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Transactions -->
    <div v-if="activeTab === 'transactions'" class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Historique des transactions</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(transaction.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full"
                  :class="getTransactionTypeClass(transaction.type)"
                >
                  <component :is="getTransactionIcon(transaction.type)" class="h-3 w-3 mr-1" />
                  {{ getTransactionLabel(transaction.type) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ transaction.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="inline-flex items-center">
                  <component :is="getPaymentMethodIcon(transaction.payment_method)" class="h-4 w-4 mr-1 text-gray-400" />
                  {{ getPaymentMethodLabel(transaction.payment_method) || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right" :class="getAmountClass(transaction.amount)">
                {{ transaction.amount > 0 ? '+' : '' }}{{ formatPrice(Math.abs(transaction.amount)) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <StatusBadge :status="getTransactionStatus(transaction.payment_status || transaction.status)" />
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
        @page-change="loadTransactions"
      />
    </div>

    <!-- Statistiques -->
    <div v-if="activeTab === 'statistics'" class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Statistiques de consommation</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">Par type de transaction</h4>
            <div class="space-y-3">
              <div v-for="stat in transactionStats" :key="stat.type" class="flex items-center justify-between">
                <span class="text-sm text-gray-600">{{ stat.label }}</span>
                <div class="flex-1 mx-4">
                  <div class="bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full"
                      :class="stat.color"
                      :style="{ width: `${stat.percentage}%` }"
                    ></div>
                  </div>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ formatPrice(stat.total) }}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">Par méthode de paiement</h4>
            <div class="space-y-3">
              <div v-for="method in paymentMethodStats" :key="method.method" class="flex items-center justify-between">
                <span class="text-sm text-gray-600">{{ method.label }}</span>
                <div class="flex-1 mx-4">
                  <div class="bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-primary-600 h-2 rounded-full"
                      :style="{ width: `${method.percentage}%` }"
                    ></div>
                  </div>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ formatPrice(method.total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Code promo -->
    <div v-if="activeTab === 'promo'" class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Code promo</h3>
      </div>
      <div class="card-body">
        <div class="max-w-md">
          <p class="text-sm text-gray-600 mb-4">
            Entrez un code promo pour bénéficier d'une remise sur votre prochain rechargement.
          </p>
          <div class="flex space-x-3">
            <input
              v-model="promoCode"
              type="text"
              placeholder="EX: WELCOME20"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <button @click="applyPromoCode" class="btn-primary">Appliquer</button>
          </div>
          <div v-if="promoResult" class="mt-4 p-3 rounded-lg" :class="promoResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
            <p class="text-sm">{{ promoResult.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { 
  PlusIcon, 
  ArrowTrendingDownIcon, 
  EnvelopeIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline';
import Pagination from '../../components/common/Pagination.vue';
import StatusBadge from '../../components/common/StatusBadge.vue';

const toast = useToast();

// États
const balance = ref(45500);
const totalSpent = ref(125000);
const totalSmsSent = ref(12450);
const userTier = ref('Premium');
const smsPrice = ref(5);
const transactions = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const perPage = ref(10);
const activeTab = ref('transactions');
const promoCode = ref('');
const promoResult = ref(null);

const tabs = [
  { id: 'transactions', name: 'Transactions' },
  { id: 'statistics', name: 'Statistiques' },
  { id: 'promo', name: 'Code promo' }
];

// Données de test pour les transactions avec tous les statuts
const mockTransactions = [
  {
    id: 1,
    type: 'deposit',
    description: 'Rechargement via Orange Money - Pack Business',
    amount: 25000,
    payment_method: 'orange_money',
    payment_status: 'completed',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    type: 'sms',
    description: 'Campagne "Promotion Noël" - 500 SMS',
    amount: -2500,
    payment_method: null,
    payment_status: 'completed',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    type: 'deposit',
    description: 'Rechargement via Carte bancaire - Pack Starter',
    amount: 5000,
    payment_method: 'card',
    payment_status: 'processing',
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 4,
    type: 'withdrawal',
    description: 'Retrait commission revendeur',
    amount: -15000,
    payment_method: 'wave',
    payment_status: 'pending',
    created_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 5,
    type: 'refund',
    description: 'Remboursement - Paiement échoué',
    amount: 5000,
    payment_method: 'orange_money',
    payment_status: 'completed',
    created_at: new Date(Date.now() - 345600000).toISOString()
  }
];

// Statistiques pour l'onglet statistiques
const transactionStats = computed(() => {
  const totals = {
    deposit: 0,
    sms: 0,
    withdrawal: 0,
    refund: 0
  };
  
  transactions.value.forEach(t => {
    if (t.type === 'deposit') totals.deposit += t.amount;
    else if (t.type === 'sms') totals.sms += Math.abs(t.amount);
    else if (t.type === 'withdrawal') totals.withdrawal += Math.abs(t.amount);
    else if (t.type === 'refund') totals.refund += t.amount;
  });
  
  const total = totals.deposit + totals.sms + totals.withdrawal + totals.refund;
  
  return [
    { type: 'deposit', label: 'Dépôts', total: totals.deposit, percentage: (totals.deposit / total) * 100, color: 'bg-green-500' },
    { type: 'sms', label: 'SMS', total: totals.sms, percentage: (totals.sms / total) * 100, color: 'bg-blue-500' },
    { type: 'withdrawal', label: 'Retraits', total: totals.withdrawal, percentage: (totals.withdrawal / total) * 100, color: 'bg-red-500' },
    { type: 'refund', label: 'Remboursements', total: totals.refund, percentage: (totals.refund / total) * 100, color: 'bg-yellow-500' }
  ];
});

const paymentMethodStats = computed(() => {
  const totals = {
    orange_money: 0,
    mtn_money: 0,
    wave: 0,
    card: 0,
    crypto: 0
  };
  
  transactions.value.forEach(t => {
    if (t.payment_method && totals[t.payment_method] !== undefined) {
      totals[t.payment_method] += Math.abs(t.amount);
    }
  });
  
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  
  return [
    { method: 'orange_money', label: 'Orange Money', total: totals.orange_money, percentage: (totals.orange_money / total) * 100 },
    { method: 'mtn_money', label: 'MTN Money', total: totals.mtn_money, percentage: (totals.mtn_money / total) * 100 },
    { method: 'wave', label: 'Wave', total: totals.wave, percentage: (totals.wave / total) * 100 },
    { method: 'card', label: 'Carte bancaire', total: totals.card, percentage: (totals.card / total) * 100 },
    { method: 'crypto', label: 'Crypto', total: totals.crypto, percentage: (totals.crypto / total) * 100 }
  ].filter(m => m.total > 0);
});

// Fonctions utilitaires
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price || 0);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Types de transaction
const getTransactionTypeClass = (type) => {
  const classes = {
    deposit: 'bg-green-100 text-green-800',
    sms: 'bg-blue-100 text-blue-800',
    withdrawal: 'bg-red-100 text-red-800',
    refund: 'bg-yellow-100 text-yellow-800'
  };
  return classes[type] || 'bg-gray-100 text-gray-800';
};

const getTransactionLabel = (type) => {
  const labels = {
    deposit: 'Dépôt',
    sms: 'SMS',
    withdrawal: 'Retrait',
    refund: 'Remboursement'
  };
  return labels[type] || type;
};

const getTransactionIcon = (type) => {
  const icons = {
    deposit: '💰',
    sms: '📱',
    withdrawal: '💸',
    refund: '↩️'
  };
  return icons[type] || '📊';
};

// Méthodes de paiement
const getPaymentMethodIcon = (method) => {
  const icons = {
    orange_money: DevicePhoneMobileIcon,
    mtn_money: DevicePhoneMobileIcon,
    wave: BanknotesIcon,
    card: CreditCardIcon,
    crypto: CurrencyDollarIcon
  };
  return icons[method] || CreditCardIcon;
};

const getPaymentMethodLabel = (method) => {
  const labels = {
    orange_money: 'Orange Money',
    mtn_money: 'MTN Money',
    wave: 'Wave',
    card: 'Carte bancaire',
    crypto: 'Crypto (USDT)'
  };
  return labels[method];
};

// Statut de transaction (pour StatusBadge)
const getTransactionStatus = (status) => {
  const statusMap = {
    pending: 'pending',
    processing: 'processing',
    completed: 'completed',
    success: 'completed',
    failed: 'failed',
    queued: 'queued'
  };
  return statusMap[status] || 'pending';
};

const getAmountClass = (amount) => {
  return amount > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium';
};

// Chargement des transactions
const loadTransactions = async () => {
  // Simulation de chargement
  await new Promise(resolve => setTimeout(resolve, 500));
  transactions.value = mockTransactions;
  totalItems.value = mockTransactions.length;
  totalPages.value = 1;
};

// Application du code promo
const applyPromoCode = () => {
  if (!promoCode.value.trim()) {
    toast.error('Veuillez entrer un code promo');
    return;
  }
  
  // Simulation de validation
  if (promoCode.value.toUpperCase() === 'promo de fin année') {
    promoResult.value = {
      success: true,
      message: 'Code promo valide ! Vous bénéficiez de 20% de réduction sur votre prochain rechargement.'
    };
    toast.success('Code promo appliqué !');
  } else {
    promoResult.value = {
      success: false,
      message: 'Code promo invalide ou expiré.'
    };
    toast.error('Code promo invalide');
  }
};

onMounted(() => {
  loadTransactions();
});
</script>