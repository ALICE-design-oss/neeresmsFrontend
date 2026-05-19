<template>
  <div v-if="message" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
    <h4 class="text-sm font-medium text-gray-700 mb-2">Aperçu du SMS</h4>
    <div class="relative">
      <!-- Simulation de bulle de message -->
      <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-500">
            De: {{ senderId || 'NeereSMS' }}
          </span>
          <span class="text-xs text-gray-400">
            {{ smsCount }} SMS
          </span>
        </div>
        <p class="text-gray-800 text-sm whitespace-pre-wrap break-words">
          {{ message }}
        </p>
        <div class="mt-2 flex justify-between items-center">
          <span class="text-xs text-gray-400">
            {{ characterCount }} caractères
          </span>
          <span class="text-xs font-medium text-primary-600">
            {{ formatPrice(estimatedCost) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  senderId: {
    type: String,
    default: ''
  },
  estimatedCost: {
    type: Number,
    default: 0
  },
  characterCount: {
    type: Number,
    default: 0
  },
  smsCount: {
    type: Number,
    default: 0
  }
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price);
};
</script>