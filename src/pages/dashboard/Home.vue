<template>
  <div class="space-y-6">
    <!-- Header avec bienvenue -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">
          Bonjour, {{ userName }} 👋
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Voici un résumé de votre activité sur NeereSMS
        </p>
      </div>
      <div class="flex space-x-3">
        <router-link to="/sms/send" class="btn-primary">
          <EnvelopeIcon class="h-5 w-5 mr-2" />
          Nouveau SMS
        </router-link>
      </div>
    </div>

    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Solde Wallet -->
      <div class="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Solde Wallet</p>
              <p class="text-2xl font-bold">{{ formatPrice(walletBalance) }}</p>
              <p class="text-xs opacity-75 mt-1">
                -- SMS disponibles
              </p>
            </div>
            <div class="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <WalletIcon class="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- SMS ce mois -->
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">SMS ce mois</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatNumber(totalSms) }}</p>
              <p class="text-xs text-green-600 mt-1">
                -- vs mois dernier
              </p>
            </div>
            <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <EnvelopeIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Taux de livraison -->
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Taux de livraison</p>
              <p class="text-2xl font-bold text-green-600">{{ deliveryRate }}%</p>
              <div class="w-24 mt-1">
                <div class="bg-gray-200 rounded-full h-1.5">
                  <div
                    class="bg-green-600 h-1.5 rounded-full"
                    :style="{ width: `${deliveryRate}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <ChartBarIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Campagnes actives -->
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Campagnes actives</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeCampaigns }}</p>
              <p class="text-xs text-gray-500 mt-1">
                {{ totalCampaigns }} au total
              </p>
            </div>
            <div class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <MegaphoneIcon class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques avec ApexCharts -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Graphique SMS par jour (Line Chart) -->
      <div class="card">
        <div class="card-header flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">SMS envoyés</h3>
          <div class="flex space-x-2">
            <button
              v-for="period in periods"
              :key="period.value"
              @click="changePeriod(period.value)"
              class="px-3 py-1 text-sm rounded-md transition-all duration-200"
              :class="[
                selectedPeriod === period.value
                  ? 'bg-primary-600 text-white shadow-sm'
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
          <div v-else-if="dailyChartSeries[0]?.data.every(v => v === 0)" class="h-80 flex items-center justify-center text-gray-400">
            Aucune donnée disponible
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
          <div v-if="countryChartSeries.every(v => v === 0)" class="h-80 flex items-center justify-center text-gray-400">
            Aucune donnée disponible
          </div>
          <div v-else class="h-80">
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
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Graphique SMS réussis / échoués (Bar Chart) -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Statut des envois</h3>
        </div>
        <div class="card-body">
          <div v-if="statusChartSeries.every(s => s.data.every(v => v === 0))" class="h-80 flex items-center justify-center text-gray-400">
            Aucune donnée disponible
          </div>
          <div v-else class="h-80">
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
          <div v-if="providerChartSeries.every(v => v === 0)" class="h-80 flex items-center justify-center text-gray-400">
            Aucune donnée disponible
          </div>
          <div v-else class="h-80">
            <apexchart
              type="donut"
              :options="providerChartOptions"
              :series="providerChartSeries"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Derniers SMS et Campagnes -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Derniers SMS -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Derniers SMS envoyés</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destinataire</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="recentSms.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                  Aucun SMS envoyé pour le moment
                </td>
              </tr>
              <tr v-for="sms in recentSms" :key="sms.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ sms.recipient }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                  {{ sms.message }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(sms.status)"
                  >
                    {{ getStatusLabel(sms.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(sms.sent_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-footer bg-gray-50 px-6 py-3">
          <router-link to="/reports" class="text-sm text-primary-600 hover:text-primary-500">
            Voir tout l'historique →
          </router-link>
        </div>
      </div>

      <!-- Dernières campagnes -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Dernières campagnes</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Progression</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="recentCampaigns.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                  Aucune campagne créée
                </td>
              </tr>
              <tr v-for="campaign in recentCampaigns" :key="campaign.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ campaign.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getCampaignStatusClass(campaign.status)"
                  >
                    {{ getCampaignStatusLabel(campaign.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-end space-x-2">
                    <span class="text-sm text-gray-600">{{ campaign.progress }}%</span>
                    <div class="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-primary-600 h-2 rounded-full"
                        :style="{ width: `${campaign.progress}%` }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(campaign.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-footer bg-gray-50 px-6 py-3">
          <router-link to="/campaigns" class="text-sm text-primary-600 hover:text-primary-500">
            Gérer les campagnes →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../store/user';
import Loader from '../../components/common/Loader.vue';
import {
  EnvelopeIcon,
  WalletIcon,
  ChartBarIcon,
  MegaphoneIcon
} from '@heroicons/vue/24/outline';

const userStore = useUserStore();

// États - Toutes les valeurs sont initialisées à 0 ou vide
const loadingChart = ref(false);
const selectedPeriod = ref('week');

// Données utilisateur
const userName = ref(userStore.user?.name || 'Utilisateur');
const walletBalance = ref(0);
const totalSms = ref(0);
const deliveryRate = ref(0);
const activeCampaigns = ref(0);
const totalCampaigns = ref(0);
const growthRate = ref(0);

// Données par période - Valeurs à 0 par défaut
const chartData = {
  week: {
    categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    series: [{ name: 'SMS envoyés', data: [0, 0, 0, 0, 0, 0, 0] }]
  },
  month: {
    categories: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
    series: [{ name: 'SMS envoyés', data: [0, 0, 0, 0] }]
  },
  year: {
    categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    series: [{ name: 'SMS envoyés', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }]
  }
};

// Périodes disponibles
const periods = [
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'year', label: 'Année' }
];

// Options du graphique SMS par jour (Line Chart)
const dailyChartOptions = ref({
  chart: {
    type: 'line',
    toolbar: { show: true, tools: { download: false, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } },
    zoom: { enabled: false },
    fontFamily: 'Inter, sans-serif',
    animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  xaxis: {
    categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    labels: { style: { colors: '#6B7280', fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    title: { text: 'Nombre de SMS', style: { color: '#6B7280', fontSize: '12px' } },
    labels: { style: { colors: '#6B7280', fontSize: '12px' } },
    min: 0
  },
  colors: ['#3B82F6'],
  stroke: { curve: 'smooth', width: 3, lineCap: 'round' },
  markers: { size: 5, colors: ['#3B82F6'], strokeColors: '#fff', strokeWidth: 2, hover: { size: 7 } },
  grid: { borderColor: '#E5E7EB', strokeDashArray: 4, padding: { top: 10, right: 10, bottom: 10, left: 10 } },
  tooltip: { 
    theme: 'light', 
    y: { formatter: (value) => `${value.toLocaleString('fr-FR')} SMS` },
    marker: { show: true }
  },
  fill: { type: 'gradient', gradient: { shadeIntensity: 0.5, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] } }
});

const dailyChartSeries = ref([{ name: 'SMS envoyés', data: [0, 0, 0, 0, 0, 0, 0] }]);

// Configuration du graphique par pays (Pie Chart)
const countryChartOptions = ref({
  chart: { type: 'pie', fontFamily: 'Inter, sans-serif' },
  labels: ['Côte d\'Ivoire', 'Sénégal', 'Burkina Faso', 'Mali', 'France', 'Autres'],
  colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'],
  legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '12px' },
  tooltip: { y: { formatter: (value) => `${value.toLocaleString('fr-FR')} SMS` } }
});

const countryChartSeries = ref([0, 0, 0, 0, 0, 0]);

// Configuration du graphique des statuts (Bar Chart)
const statusChartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
    animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 8,
      borderRadiusApplication: 'end'
    }
  },
  xaxis: {
    categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
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
  { name: 'Réussis', data: [0, 0, 0, 0, 0, 0, 0] },
  { name: 'Échoués', data: [0, 0, 0, 0, 0, 0, 0] }
]);

// Configuration du graphique par fournisseur (Donut Chart)
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
            formatter: () => '0',
            fontSize: '16px',
            fontWeight: 'bold'
          } 
        } 
      } 
    }
  },
  tooltip: { y: { formatter: (value) => `${value.toLocaleString('fr-FR')} SMS` } }
});

const providerChartSeries = ref([0, 0, 0]);

// Derniers SMS - Tableau vide
const recentSms = ref([]);

// Dernières campagnes - Tableau vide
const recentCampaigns = ref([]);

// Fonctions utilitaires
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price || 0);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num || 0);
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

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
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

const getCampaignStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    paused: 'bg-gray-100 text-gray-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getCampaignStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    processing: 'En cours',
    completed: 'Terminé',
    failed: 'Échoué',
    paused: 'En pause'
  };
  return labels[status] || status;
};

// Changer la période des graphiques
const changePeriod = (period) => {
  loadingChart.value = true;
  selectedPeriod.value = period;
  
  setTimeout(() => {
    const data = chartData[period];
    if (data) {
      dailyChartOptions.value = {
        ...dailyChartOptions.value,
        xaxis: {
          ...dailyChartOptions.value.xaxis,
          categories: data.categories
        }
      };
      dailyChartSeries.value = data.series;
    }
    loadingChart.value = false;
  }, 300);
};

onMounted(() => {
  changePeriod('week');
});
</script>