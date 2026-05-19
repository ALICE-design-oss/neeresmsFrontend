<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <button @click="goBack" class="text-gray-400 hover:text-gray-500">
          <ArrowLeftIcon class="h-6 w-6" />
        </button>
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ isEditing ? 'Modifier la campagne' : 'Nouvelle campagne' }}
        </h1>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <CampaignForm
          ref="campaignFormRef"
          :initial-data="campaign"
          @submit="saveCampaign"
        />
        
        <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button @click="goBack" class="btn-secondary">
            Annuler
          </button>
          <button @click="submitForm" class="btn-primary">
            {{ isEditing ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import CampaignForm from '../../components/campaigns/CampaignForm.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const campaignFormRef = ref(null);
const campaign = ref({
  name: '',
  message: '',
  sender_id: '',
  schedule: false,
  scheduled_at: ''
});

const isEditing = computed(() => !!route.params.id && route.params.id !== 'new');

const loadCampaign = async () => {
  if (isEditing.value) {
    try {
      // Simuler le chargement d'une campagne existante
      /*await new Promise(resolve => setTimeout(resolve, 500));
      campaign.value = {
        name: 'Campagne promotionnelle',
        message: 'Profitez de nos offres exceptionnelles !',
        sender_id: 'NeereSMS',
        schedule: false,
        scheduled_at: ''
      };
    } catch (error) {
      toast.error('Erreur lors du chargement');
      router.push('/campaigns');
    }
  }
};*/

const saveCampaign = async (campaignData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success(isEditing.value ? 'Campagne mise à jour' : 'Campagne créée');
    router.push('/campaigns');
  } catch (error) {
    toast.error('Erreur lors de l\'enregistrement');
  }
};

const submitForm = () => {
  campaignFormRef.value?.submit();
};

const goBack = () => {
  router.push('/campaigns');
};

onMounted(() => {
  loadCampaign();
});
</script>