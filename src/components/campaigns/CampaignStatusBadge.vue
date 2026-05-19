<template>
  <span
    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
    :class="statusClass"
  >
    <span class="flex items-center">
      <span v-if="isLoading" class="animate-pulse mr-1">●</span>
      <component :is="icon" class="h-3 w-3 mr-1" />
      {{ statusText }}
    </span>
  </span>
</template>

<script setup>
import { computed } from 'vue';
import {
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  PauseIcon
} from '@heroicons/vue/24/solid';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['pending', 'processing', 'completed', 'failed', 'paused'].includes(value)
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const statusConfig = {
  pending: {
    text: 'En attente',
    class: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon
  },
  processing: {
    text: 'En cours',
    class: 'bg-blue-100 text-blue-800',
    icon: PlayIcon
  },
  completed: {
    text: 'Terminé',
    class: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon
  },
  failed: {
    text: 'Échoué',
    class: 'bg-red-100 text-red-800',
    icon: XCircleIcon
  },
  paused: {
    text: 'En pause',
    class: 'bg-gray-100 text-gray-800',
    icon: PauseIcon
  }
};

const statusClass = computed(() => statusConfig[props.status]?.class || 'bg-gray-100 text-gray-800');
const statusText = computed(() => statusConfig[props.status]?.text || props.status);
const icon = computed(() => statusConfig[props.status]?.icon || ClockIcon);
</script>