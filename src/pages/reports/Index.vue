<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Rapports et Statistiques</h1>
        <p class="mt-1 text-sm text-gray-500">
          Analysez vos envois SMS et suivez vos performances
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportData('csv')" class="btn-secondary">
          <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
          CSV
        </button>
        <button @click="exportData('excel')" class="btn-secondary">
          <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
          Excel
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Date de début</label>
            <input
              v-model="filters.date_start"
              type="date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date de fin</label>
            <input
              v-model="filters.date_end"
              type="date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Campagne</label>
            <select
              v-model="filters.campaign"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">Toutes</option>
              <option v-for="camp in campaigns" :key="camp.id" :value="camp.id">
                {{ camp.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Statut</label>
            <select
              v-model="filters.status"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">Tous</option>
              <option value="delivered">Livré</option>
              <option value="sent">Envoyé</option>
              <option value="failed">Échoué</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="applyFilters" class="btn-primary">
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>

    <!-- Cartes statistiques -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total SMS</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatNumber(stats.total_sms) }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <EnvelopeIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div class="mt-2 text-sm">
            <span class="text-green-600">↑ {{ stats.growth }}%</span>
            <span class="text-gray-500"> vs mois dernier</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Taux de livraison</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.delivery_rate }}%</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Coût total</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatPrice(stats.total_cost) }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <CurrencyDollarIcon class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Temps moyen</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.avg_delivery_time }}s</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques avec ApexCharts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Graphique SMS par jour (Line Chart) -->
      <div class="card">
        <div class="card-header flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">SMS envoyés</h3>
          <div class="flex space-x-2">
            <button
              v-for="period in periods"
              :key="period.value"
              @click="changeChartPeriod(period.value)"
              class="px-2 py-1 text-xs rounded-md transition"
              :class="[
                selectedChartPeriod === period.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loadingChart" class="h-80 flex items-center justify-center">
            <Loader />
          </div>
          <div v-else class="h-80">
            <apexchart
              type="line"
              :options="dailyChartOptions"
              :series="dailyChartSeries"
            />
          </div>
        </div>
      </div>

      <!-- Graphique SMS par pays (Pie Chart) -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Distribution par pays</h3>
        </div>
        <div class="card-body">
          <div class="h-80">
            <apexchart
              type="pie"
              :options="countryChartOptions"
              :series="countryChartSeries"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Deuxième ligne de graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Graphique SMS par statut (Bar Chart) -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Statut des envois</h3>
        </div>
        <div class="card-body">
          <div class="h-80">
            <apexchart
              type="bar"
              :options="statusChartOptions"
              :series="statusChartSeries"
            />
          </div>
        </div>
      </div>

      <!-- Graphique par fournisseur (Donut Chart) -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Répartition par fournisseur</h3>
        </div>
        <div class="card-body">
          <div class="h-80">
            <apexchart
              type="donut"
              :options="providerChartOptions"
              :series="providerChartSeries"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Performances par fournisseur -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Performances par fournisseur</h3>
      </div>
      <div class="card-body">
        <div class="space-y-4">
          <div
            v-for="provider in providerStats"
            :key="provider.name"
            class="border rounded-lg p-4"
          >
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center space-x-3">
                <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <span class="text-lg">{{ provider.icon }}</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ provider.name }}</p>
                  <p class="text-xs text-gray-500">{{ provider.countries.join(', ') }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ formatNumber(provider.sms_sent) }} SMS</p>
                <p class="text-xs" :class="provider.delivery_rate > 95 ? 'text-green-600' : 'text-yellow-600'">
                  {{ provider.delivery_rate }}% livrés
                </p>
              </div>
            </div>
            <div class="mt-2">
              <div class="bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all"
                  :class="provider.delivery_rate > 95 ? 'bg-green-600' : 'bg-yellow-600'"
                  :style="{ width: `${provider.delivery_rate}%` }"
                ></div>
              </div>
            </div>
            <div class="flex justify-between mt-2 text-xs text-gray-500">
              <span>Prix moyen: {{ formatPrice(provider.avg_price) }}/SMS</span>
              <span>Temps moyen: {{ provider.avg_time }}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Historique SMS -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Historique des SMS</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destinataire</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fournisseur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Coût</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="sms in smsHistory" :key="sms.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(sms.sent_at) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ sms.recipient }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                {{ sms.message }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                  {{ sms.provider }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(sms.status)"
                >
                  {{ getStatusLabel(sms.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                {{ formatPrice(sms.cost) }}
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
        @page-change="loadSmsHistory"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import {
  EnvelopeIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline';
import Pagination from '../../components/common/Pagination.vue';
import Loader from '../../components/common/Loader.vue';

const toast = useToast();

// États
const loadingChart = ref(false);
const selectedChartPeriod = ref('week');

// Statistiques
const stats = ref({
  total_sms: 0,
  delivery_rate: 0,
  total_cost: 0,
  avg_delivery_time: 0,
  growth: 0
});

// Filtres
const filters = reactive({
  date_start: '',
  date_end: '',
  campaign: '',
  status: ''
});

const campaigns = ref(/*[
  { id: 1, name: 'Promotion Noël' },
  { id: 2, name: 'OTP Verification' },
  { id: 3, name: 'Marketing Q1' }
]*/);

// Données des graphiques
const periods = [
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'year', label: 'Année' }
];

// Données pour le graphique SMS par jour
const chartData = {
  week: {
    categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    series: [{ name: 'SMS envoyés', data: [120, 150, 180, 220, 280, 190, 140] }]
  },
  month: {
    categories: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
    series: [{ name: 'SMS envoyés', data: [850, 1240, 1980, 1450] }]
  },
  year: {
    categories: ['Janvier', 'Février', 'Mars', 'Avrril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    series: [{ name: 'SMS envoyés', data: [3200, 3800, 4500, 5200, 6100, 7800, 8900, 9200, 8500, 7900, 7200, 6800] }]
  }
};

// Configuration du graphique SMS par jour
const dailyChartOptions = ref({
  chart: {
    type: 'line',
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Inter, sans-serif',
    animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  xaxis: {
    categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    labels: { style: { colors: '#6B7280', fontSize: '12px' } }
  },
  yaxis: {
    title: { text: 'Nombre de SMS', style: { color: '#6B7280' } },
    labels: { style: { colors: '#6B7280', fontSize: '12px' } },
    min: 0
  },
  colors: ['#3B82F6'],
  stroke: { curve: 'smooth', width: 3 },
  markers: { size: 4, colors: ['#3B82F6'], strokeColors: '#fff', strokeWidth: 2 },
  grid: { borderColor: '#E5E7EB', strokeDashArray: 4 },
  tooltip: { y: { formatter: (value) => `${value.toLocaleString('fr-FR')} SMS` } }
});

const dailyChartSeries = ref([{ name: 'SMS envoyés', data: [120, 150, 180, 220, 280, 190, 140] }]);

// Configuration du graphique par pays
const countryChartOptions = ref({
  chart: { 
    type: 'pie', 
    fontFamily: 'Inter, sans-serif',
    animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  labels: ['Côte d\'Ivoire', 'Sénégal', 'Burkina Faso', 'Mali', 'France', 'Autres'],
  colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'],
  legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '12px' },
  dataLabels: { 
    enabled: true,
    formatter: function(val) {
      return `${val.toFixed(1)}%`;
    },
    style: { fontSize: '12px', fontWeight: 'bold', colors: ['#1F2937'] }
  },
  tooltip: { 
    y: { 
      formatter: function(value) {
        return `${value.toLocaleString('fr-FR')} SMS`;
      }
    }
  }
});

const countryChartSeries = ref([4500, 2800, 1900, 1200, 800, 450]);

// Configuration du graphique des statuts
const statusChartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
    animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  plotOptions: {
    bar: { horizontal: false, columnWidth: '55%', borderRadius: 8 }
  },
  xaxis: {
    categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    labels: { style: { colors: '#6B7280', fontSize: '12px' } }
  },
  yaxis: {
    title: { text: 'Nombre de SMS', style: { color: '#6B7280' } },
    labels: { style: { colors: '#6B7280', fontSize: '12px' } }
  },
  colors: ['#10B981', '#EF4444'],
  legend: { position: 'top', fontSize: '12px' },
  grid: { borderColor: '#E5E7EB' },
  tooltip: { y: { formatter: (value) => `${value.toLocaleString('fr-FR')} SMS` } }
});

const statusChartSeries = ref([
  { name: 'Réussis', data: [98, 112, 145, 188, 242, 165, 118] },
  { name: 'Échoués', data: [2, 3, 5, 4, 8, 5, 2] }
]);

// Configuration du graphique par fournisseur
const providerChartOptions = ref({
  chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
  labels: ['Hub2 (Afrique)', 'Infobip (International)', 'SMSPartner (Europe)'],
  colors: ['#3B82F6', '#8B5CF6', '#10B981'],
  legend: { position: 'bottom', fontSize: '12px' },
  dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` },
  plotOptions: {
    pie: { 
      donut: { 
        size: '65%', 
        labels: { 
          show: true, 
          total: { 
            show: true, 
            label: 'Total SMS', 
            formatter: () => '12,450',
            fontSize: '16px',
            fontWeight: 'bold'
          } 
        } 
      } 
    }
  },
  tooltip: { y: { formatter: (value) => `${value.toLocaleString('fr-FR')} SMS` } }
});

const providerChartSeries = ref([8450, 3200, 800]);

// Performances par fournisseur
const providerStats = ref([
  {
    name: 'Hub2',
    icon: '🇨🇮',
    countries: ['Côte d\'Ivoire', 'Sénégal', 'Burkina Faso', 'Mali'],
    sms_sent: 8450,
    delivery_rate: 98.2,
    avg_price: 4.5,
    avg_time: 1.8
  },
  {
    name: 'Infobip',
    icon: '🌍',
    countries: ['International'],
    sms_sent: 3200,
    delivery_rate: 99.1,
    avg_price: 5.2,
    avg_time: 2.1
  },
  {
    name: 'SMSPartner',
    icon: '🇪🇺',
    countries: ['France', 'Belgique', 'Suisse'],
    sms_sent: 800,
    delivery_rate: 97.5,
    avg_price: 4.8,
    avg_time: 1.5
  }
]);

// Historique SMS
const smsHistory = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const perPage = ref(20);

// Fonctions utilitaires
const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price);
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status) => {
  const classes = {
    delivered: 'bg-green-100 text-green-800',
    sent: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status) => {
  const labels = {
    delivered: 'Livré',
    sent: 'Envoyé',
    failed: 'Échoué',
    pending: 'En attente'
  };
  return labels[status] || status;
};

// Changer la période du graphique
const changeChartPeriod = (period) => {
  loadingChart.value = true;
  selectedChartPeriod.value = period;
  
  setTimeout(() => {
    const data = chartData[period];
    if (data) {
      dailyChartOptions.value = {
        ...dailyChartOptions.value,
        xaxis: { ...dailyChartOptions.value.xaxis, categories: data.categories }
      };
      dailyChartSeries.value = data.series;
    }
    loadingChart.value = false;
  }, 300);
};

// Charger l'historique des SMS
const loadSmsHistory = async () => {
  smsHistory.value = [
    {
      id: 1,
      recipient: '+225 07 00 00 01',
      message: 'Bienvenue sur NeereSMS',
      provider: 'Hub2',
      status: 'delivered',
      cost: 5,
      sent_at: new Date().toISOString()
    },
    {
      id: 2,
      recipient: '+225 07 00 00 02',
      message: 'Votre code OTP est 123456',
      provider: 'Hub2',
      status: 'delivered',
      cost: 5,
      sent_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 3,
      recipient: '+33 6 00 00 00 00',
      message: 'Promotion exclusive ce weekend',
      provider: 'SMSPartner',
      status: 'sent',
      cost: 8,
      sent_at: new Date(Date.now() - 7200000).toISOString()
    }
  ];
  totalPages.value = 1;
  totalItems.value = 3;
};

// Appliquer les filtres
const applyFilters = () => {
  loadSmsHistory();
  toast.info('Filtres appliqués');
};

// Exporter les données
const exportData = (format) => {
  toast.success(`Export ${format.toUpperCase()} démarré`);
};

onMounted(() => {
  loadSmsHistory();
  changeChartPeriod('week');
});
</script>