<template>
  <span 
    class="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full"
    :class="statusClass"
  >
    <span v-if="isAnimated" class="animate-pulse mr-1">●</span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => [
      'queued', 'sending', 'sent', 'delivered', 'failed', 'bounced', 'pending', 'processing', 'completed'
    ].includes(value)
  }
});

const statusConfig = {
  queued: { label: 'En file d\'attente', class: 'bg-gray-100 text-gray-800', animated: true },
  sending: { label: 'Envoi en cours', class: 'bg-blue-100 text-blue-800', animated: true },
  sent: { label: 'Envoyé', class: 'bg-blue-100 text-blue-800', animated: false },
  delivered: { label: 'Livré', class: 'bg-green-100 text-green-800', animated: false },
  failed: { label: 'Échoué', class: 'bg-red-100 text-red-800', animated: false },
  bounced: { label: 'Rebondi', class: 'bg-orange-100 text-orange-800', animated: false },
  pending: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800', animated: true },
  processing: { label: 'En cours', class: 'bg-blue-100 text-blue-800', animated: true },
  completed: { label: 'Terminé', class: 'bg-green-100 text-green-800', animated: false }
};

const config = computed(() => statusConfig[props.status] || { label: props.status, class: 'bg-gray-100 text-gray-800', animated: false });
const label = computed(() => config.value.label);
const statusClass = computed(() => config.value.class);
const isAnimated = computed(() => config.value.animated);
</script>