<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Journal des requêtes API</h1>
        <p class="mt-1 text-sm text-gray-500">
          Historique complet de toutes les requêtes effectuées vers l'API
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="refreshLogs" class="btn-secondary">
          <ArrowPathIcon class="h-5 w-5 mr-2" />
          Rafraîchir
        </button>
        <button @click="exportLogs" class="btn-secondary">
          <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
          Exporter
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Endpoint</label>
            <input 
              v-model="filters.endpoint" 
              type="text" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="/sms/send"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Méthode</label>
            <select 
              v-model="filters.method" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">Toutes</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Statut</label>
            <select 
              v-model="filters.status" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">Tous</option>
              <option value="success">Succès (2xx)</option>
              <option value="error">Erreur (4xx/5xx)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Période</label>
            <select 
              v-model="filters.period" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">7 derniers jours</option>
              <option value="month">30 derniers jours</option>
              <option value="all">Tout</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="applyFilters" class="btn-primary">Appliquer les filtres</button>
        </div>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="card bg-blue-50">
        <div class="card-body py-3">
          <p class="text-xs text-blue-600">Total requêtes</p>
          <p class="text-2xl font-bold text-blue-900">{{ formatNumber(stats.total) }}</p>
        </div>
      </div>
      <div class="card bg-green-50">
        <div class="card-body py-3">
          <p class="text-xs text-green-600">Succès</p>
          <p class="text-2xl font-bold text-green-900">{{ formatNumber(stats.success) }}</p>
        </div>
      </div>
      <div class="card bg-red-50">
        <div class="card-body py-3">
          <p class="text-xs text-red-600">Erreurs</p>
          <p class="text-2xl font-bold text-red-900">{{ formatNumber(stats.errors) }}</p>
        </div>
      </div>
      <div class="card bg-purple-50">
        <div class="card-body py-3">
          <p class="text-xs text-purple-600">Temps moyen</p>
          <p class="text-2xl font-bold text-purple-900">{{ stats.avgResponseTime }}ms</p>
        </div>
      </div>
    </div>

    <!-- Tableau des logs -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temps</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(log.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-mono rounded" :class="getMethodClass(log.method)">
                  {{ log.method }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-mono text-gray-900">
                {{ log.endpoint }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded" :class="getStatusClass(log.response_code)">
                  {{ log.response_code }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getResponseTimeClass(log.response_time)">
                {{ log.response_time }}ms
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ log.ip_address }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {{ maskApiKey(log.api_key) }}
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
        @page-change="loadLogs"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { ArrowPathIcon, DocumentArrowDownIcon } from '@heroicons/vue/24/outline';
import Pagination from '../../components/common/Pagination.vue';

const toast = useToast();

// États
const logs = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const perPage = ref(20);
const loading = ref(false);

const stats = ref({
  total: 0,
  success: 0,
  errors: 0,
  avgResponseTime: 0
});

const filters = reactive({
  endpoint: '',
  method: '',
  status: '',
  period: 'week'
});

// Données de test
const mockLogs = [
  {
    id: 1,
    method: 'POST',
    endpoint: '/api/v1/sms/send',
    response_code: 200,
    response_time: 145,
    ip_address: '197.211.xxx.xxx',
    api_key: 'nrs_live_abc123def456ghi789',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    method: 'GET',
    endpoint: '/api/v1/wallet/balance',
    response_code: 200,
    response_time: 89,
    ip_address: '197.211.xxx.xxx',
    api_key: 'nrs_live_abc123def456ghi789',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 3,
    method: 'POST',
    endpoint: '/api/v1/sms/bulk',
    response_code: 429,
    response_time: 12,
    ip_address: '197.211.xxx.xxx',
    api_key: 'nrs_test_xyz789uvw456rst123',
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 4,
    method: 'GET',
    endpoint: '/api/v1/reports/sms',
    response_code: 500,
    response_time: 234,
    ip_address: '197.211.xxx.xxx',
    api_key: 'nrs_live_abc123def456ghi789',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// Fonctions
const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

const maskApiKey = (key) => {
  if (!key) return '••••••••';
  return key.substring(0, 8) + '••••••••';
};

const getMethodClass = (method) => {
  const classes = {
    GET: 'bg-green-100 text-green-700',
    POST: 'bg-blue-100 text-blue-700',
    PUT: 'bg-yellow-100 text-yellow-700',
    DELETE: 'bg-red-100 text-red-700'
  };
  return classes[method] || 'bg-gray-100 text-gray-700';
};

const getStatusClass = (code) => {
  if (code >= 200 && code < 300) return 'bg-green-100 text-green-700';
  if (code >= 400 && code < 500) return 'bg-yellow-100 text-yellow-700';
  if (code >= 500) return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

const getResponseTimeClass = (time) => {
  if (time < 200) return 'text-green-600';
  if (time < 500) return 'text-yellow-600';
  return 'text-red-600';
};

const loadLogs = async () => {
  loading.value = true;
  
  // Simulation d'appel API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  logs.value = mockLogs;
  totalItems.value = mockLogs.length;
  totalPages.value = 1;
  
  stats.value = {
    total: 12450,
    success: 12100,
    errors: 350,
    avgResponseTime: 245
  };
  
  loading.value = false;
};

const applyFilters = () => {
  toast.info('Filtres appliqués');
  loadLogs();
};

const refreshLogs = () => {
  loadLogs();
  toast.success('Logs actualisés');
};

const exportLogs = () => {
  toast.success('Export CSV démarré');
};

onMounted(() => {
  loadLogs();
});
</script>