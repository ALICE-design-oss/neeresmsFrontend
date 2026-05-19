<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <button @click="goBack" class="text-gray-400 hover:text-gray-500">
          <ArrowLeftIcon class="h-6 w-6" />
        </button>
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">{{ campaign.name }}</h1>
          <p class="mt-1 text-sm text-gray-500">
            Créée le {{ formatDateTime(campaign.created_at) }}
          </p>
        </div>
      </div>
      <div class="flex space-x-3">
        <button
          v-if="campaign.status === 'pending'"
          @click="startCampaign"
          class="btn-primary"
        >
          <PlayIcon class="h-5 w-5 mr-2" />
          Démarrer
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Statistiques -->
      <div class="lg:col-span-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="card">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">Statut</p>
                  <CampaignStatusBadge :status="campaign.status" class="mt-1" />
                </div>
                <div class="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <EnvelopeIcon class="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">Progression</p>
                  <p class="text-2xl font-bold text-gray-900">{{ campaign.progress }}%</p>
                </div>
                <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <ChartBarIcon class="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div class="mt-3">
                <div class="bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-primary-600 h-2 rounded-full"
                    :style="{ width: `${campaign.progress}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <p class="text-sm text-gray-500">Destinataires</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ formatNumber(campaign.total_recipients) }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatNumber(campaign.sent_count) }} envoyés
              </p>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <p class="text-sm text-gray-500">Coût total</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ formatPrice(campaign.total_cost) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Message -->
        <div class="card mt-6">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Message</h3>
          </div>
          <div class="card-body">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-gray-500">
                  De: {{ campaign.sender_id || 'NeereSMS' }}
                </span>
                <span class="text-xs text-gray-400">
                  {{ campaign.message?.length || 0 }} caractères
                </span>
              </div>
              <p class="text-gray-800 whitespace-pre-wrap">
                {{ campaign.message }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations supplémentaires -->
      <div class="lg:col-span-1">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Informations</h3>
          </div>
          <div class="card-body space-y-3">
            <div>
              <p class="text-xs text-gray-500">Date de création</p>
              <p class="text-sm text-gray-900">{{ formatDateTime(campaign.created_at) }}</p>
            </div>
            <div v-if="campaign.scheduled_at">
              <p class="text-xs text-gray-500">Programmé pour</p>
              <p class="text-sm text-gray-900">{{ formatDateTime(campaign.scheduled_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="card mt-6">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Actions</h3>
          </div>
          <div class="card-body space-y-2">
            <button
              @click="duplicateCampaign"
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentDuplicateIcon class="h-5 w-5 mr-2" />
              Dupliquer
            </button>
            <button
              @click="deleteCampaign"
              class="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <TrashIcon class="h-5 w-5 mr-2" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  ChartBarIcon,
  PlayIcon,
  DocumentDuplicateIcon,
  TrashIcon
} from '@heroicons/vue/24/outline';
import CampaignStatusBadge from '../../components/campaigns/CampaignStatusBadge.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const campaign = ref({
  id: null,
  name: '',
  message: '',
  sender_id: '',
  status: 'pending',
  total_recipients: 0,
  sent_count: 0,
  progress: 0,
  total_cost: 0,
  created_at: new Date().toISOString(),
  scheduled_at: null
});

const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('fr-FR').format(num);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price || 0);
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

const loadCampaign = async () => {
  const id = route.params.id;

  /*
  
  // Données de test
  campaign.value = {
    id: parseInt(id),
    name: 'Campagne promotionnelle',
    message: 'Profitez de nos offres exceptionnelles ! Code promo : SAVE20',
    sender_id: 'NeereSMS',
    status: 'processing',
    total_recipients: 1000,
    sent_count: 450,
    progress: 45,
    total_cost: 5000,
    created_at: new Date().toISOString(),
    scheduled_at: null
  };
};
*/
const goBack = () => {
  router.push('/campaigns');
};

const startCampaign = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Campagne démarrée');
    campaign.value.status = 'processing';
  } catch (error) {
    toast.error('Erreur lors du démarrage');
  }
};

const duplicateCampaign = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Campagne dupliquée');
    router.push('/campaigns');
  } catch (error) {
    toast.error('Erreur lors de la duplication');
  }
};

const deleteCampaign = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Campagne supprimée');
      router.push('/campaigns');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  }
};

onMounted(() => {
  loadCampaign();
});
</script>