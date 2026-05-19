<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nom
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Statut
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Destinataires
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Envoyés
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Coût
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="campaign in campaigns" :key="campaign.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <EnvelopeIcon class="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ campaign.name }}
                </div>
                <div class="text-sm text-gray-500 truncate max-w-xs">
                  {{ campaign.message_preview }}
                </div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <CampaignStatusBadge :status="campaign.status" />
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatNumber(campaign.total_recipients) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{ formatNumber(campaign.sent_count) }}
            </div>
            <div class="w-24 mt-1">
              <div class="bg-gray-200 rounded-full h-1.5">
                <div
                  class="bg-primary-600 h-1.5 rounded-full"
                  :style="{ width: `${campaign.progress}%` }"
                ></div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatPrice(campaign.total_cost) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(campaign.created_at) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex justify-end space-x-2">
              <button
                @click="$emit('view', campaign)"
                class="text-primary-600 hover:text-primary-900"
                title="Voir les détails"
              >
                <EyeIcon class="h-5 w-5" />
              </button>
              <button
                v-if="campaign.status === 'pending'"
                @click="$emit('start', campaign)"
                class="text-green-600 hover:text-green-900"
                title="Démarrer"
              >
                <PlayIcon class="h-5 w-5" />
              </button>
              <button
                v-if="campaign.status === 'processing'"
                @click="$emit('pause', campaign)"
                class="text-yellow-600 hover:text-yellow-900"
                title="Mettre en pause"
              >
                <PauseIcon class="h-5 w-5" />
              </button>
              <button
                @click="$emit('duplicate', campaign)"
                class="text-blue-600 hover:text-blue-900"
                title="Dupliquer"
              >
                <DocumentDuplicateIcon class="h-5 w-5" />
              </button>
              <button
                @click="$emit('delete', campaign)"
                class="text-red-600 hover:text-red-900"
                title="Supprimer"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {
  EnvelopeIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  DocumentDuplicateIcon,
  TrashIcon
} from '@heroicons/vue/24/outline';
import CampaignStatusBadge from './CampaignStatusBadge.vue';

defineProps({
  campaigns: {
    type: Array,
    required: true
  }
});

defineEmits(['view', 'start', 'pause', 'duplicate', 'delete']);

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

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
</script>