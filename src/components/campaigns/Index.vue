<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Campagnes SMS</h1>
        <p class="mt-1 text-sm text-gray-500">
          Créez et gérez des campagnes SMS avec programmation et suivi avancé
        </p>
      </div>
      <button @click="openCreateModal" class="btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nouvelle campagne
      </button>
    </div>

    <!-- Statistiques des campagnes -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body py-3">
          <p class="text-xs text-gray-500">Total campagnes</p>
          <p class="text-xl font-bold">{{ stats.total }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body py-3">
          <p class="text-xs text-gray-500">En cours</p>
          <p class="text-xl font-bold text-blue-600">{{ stats.processing }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body py-3">
          <p class="text-xs text-gray-500">Programmées</p>
          <p class="text-xl font-bold text-yellow-600">{{ stats.pending }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body py-3">
          <p class="text-xs text-gray-500">Terminées</p>
          <p class="text-xl font-bold text-green-600">{{ stats.completed }}</p>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="card">
      <div class="card-body">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Rechercher une campagne..."
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <select v-model="filters.status" class="px-3 py-2 border rounded-md text-sm">
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processing">En cours</option>
            <option value="completed">Terminé</option>
            <option value="failed">Échoué</option>
            <option value="paused">En pause</option>
          </select>
          <button @click="resetFilters" class="btn-secondary text-sm">Réinitialiser</button>
        </div>
      </div>
    </div>

    <!-- Tableau des campagnes -->
    <div class="card">
      <div v-if="loading" class="flex justify-center py-12">
        <Loader />
      </div>
      
      <div v-else-if="campaigns.length === 0" class="text-center py-12">
        <EnvelopeIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune campagne</h3>
        <p class="mt-1 text-sm text-gray-500">Créez votre première campagne SMS.</p>
        <div class="mt-6">
          <button @click="openCreateModal" class="btn-primary">
            Nouvelle campagne
          </button>
        </div>
      </div>
      
      <CampaignTable
        v-else
        :campaigns="campaigns"
        @view="viewCampaign"
        @start="startCampaign"
        @pause="pauseCampaign"
        @duplicate="duplicateCampaign"
        @delete="deleteCampaign"
      />
    </div>

    <!-- Modal de création -->
    <Modal :is-open="showModal" title="Nouvelle campagne" @close="closeModal">
      <CampaignForm ref="campaignFormRef" @submit="saveCampaign" />
      <template #actions>
        <button @click="closeModal" class="btn-secondary">Annuler</button>
        <button @click="submitForm" class="btn-primary">Créer la campagne</button>
      </template>
    </Modal>

    <ConfirmDialog
      :is-open="showConfirm"
      title="Supprimer la campagne"
      :message="confirmMessage"
      icon-type="warning"
      @confirm="executeDelete"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { PlusIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';
import Loader from '../../components/common/Loader.vue';
import Modal from '../../components/common/Modal.vue';
import ConfirmDialog from '../../components/common/ConfirmDialog.vue';
import CampaignTable from '../../components/campaigns/CampaignTable.vue';
import CampaignForm from '../../components/campaigns/CampaignForm.vue';

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const campaigns = ref([]);
const showModal = ref(false);
const showConfirm = ref(false);
const campaignToDelete = ref(null);
const campaignFormRef = ref(null);

const filters = reactive({ search: '', status: '' });

const stats = ref({ total: 0, processing: 0, pending: 0, completed: 0 });
const confirmMessage = ref('');

const loadCampaigns = async () => {
  loading.value = true;
  // Données de test
  /*
  campaigns.value = [
    {
      id: 1,
      name: 'Promotion Noël 2024',
      message_preview: 'Profitez de -50% sur tous nos produits jusqu\'au 31 décembre...',
      status: 'completed',
      total_recipients: 5000,
      sent_count: 5000,
      progress: 100,
      total_cost: 25000,
      scheduled_at: null,
      created_at: '2024-12-01T10:00:00'
    },
    {
      id: 2,
      name: 'Campagne OTP - Vérification',
      message_preview: 'Votre code de vérification est : {{code}}',
      status: 'processing',
      total_recipients: 1200,
      sent_count: 845,
      progress: 70,
      total_cost: 6000,
      scheduled_at: null,
      created_at: '2024-12-10T14:30:00'
    },
    {
      id: 3,
      name: 'Marketing Q1 2024',
      message_preview: 'Découvrez nos nouveaux produits et services...',
      status: 'pending',
      total_recipients: 2000,
      sent_count: 0,
      progress: 0,
      total_cost: 10000,
      scheduled_at: '2025-01-15T09:00:00',
      created_at: '2024-12-12T09:15:00'
    }
  ];
  
  
  stats.value = {
    total: 3,
    processing: 1,
    pending: 1,
    completed: 1
  };*/
  loading.value = false;
};

const resetFilters = () => {
  filters.search = '';
  filters.status = '';
  loadCampaigns();
};

const openCreateModal = () => { showModal.value = true; };
const viewCampaign = (campaign) => { router.push(`/campaigns/${campaign.id}`); };
const startCampaign = async (campaign) => { toast.success(`Campagne "${campaign.name}" démarrée`); };
const pauseCampaign = async (campaign) => { toast.success(`Campagne "${campaign.name}" mise en pause`); };
const duplicateCampaign = async (campaign) => { toast.success(`Campagne "${campaign.name}" dupliquée`); };

const deleteCampaign = (campaign) => {
  campaignToDelete.value = campaign;
  confirmMessage.value = `Supprimer "${campaign.name}" ?`;
  showConfirm.value = true;
};

const executeDelete = async () => {
  if (campaignToDelete.value) {
    campaigns.value = campaigns.value.filter(c => c.id !== campaignToDelete.value.id);
    toast.success('Campagne supprimée');
    showConfirm.value = false;
    campaignToDelete.value = null;
  }
};

const saveCampaign = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  toast.success('Campagne créée');
  closeModal();
  loadCampaigns();
};

const submitForm = () => campaignFormRef.value?.submit();
const closeModal = () => { showModal.value = false; };

onMounted(() => { loadCampaigns(); });
</script>