<template>
  <div v-if="visible" class="fixed bottom-4 right-4 z-50">
    <div 
      class="rounded-lg shadow-lg p-4 min-w-[300px]"
      :class="{
        'bg-green-50 border border-green-200': type === 'success',
        'bg-red-50 border border-red-200': type === 'error',
        'bg-blue-50 border border-blue-200': type === 'info',
        'bg-yellow-50 border border-yellow-200': type === 'warning'
      }"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <CheckCircleIcon v-if="type === 'success'" class="h-5 w-5 text-green-400" />
          <XCircleIcon v-else-if="type === 'error'" class="h-5 w-5 text-red-400" />
          <InformationCircleIcon v-else-if="type === 'info'" class="h-5 w-5 text-blue-400" />
          <ExclamationTriangleIcon v-else class="h-5 w-5 text-yellow-400" />
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium" :class="{
            'text-green-800': type === 'success',
            'text-red-800': type === 'error',
            'text-blue-800': type === 'info',
            'text-yellow-800': type === 'warning'
          }">
            {{ message }}
          </p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button @click="close" class="inline-flex rounded-md focus:outline-none">
            <XMarkIcon class="h-5 w-5" :class="{
              'text-green-400 hover:text-green-500': type === 'success',
              'text-red-400 hover:text-red-500': type === 'error',
              'text-blue-400 hover:text-blue-500': type === 'info',
              'text-yellow-400 hover:text-yellow-500': type === 'warning'
            }" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000
  }
});

const visible = ref(true);

const emit = defineEmits(['close']);

const close = () => {
  visible.value = false;
  emit('close');
};

onMounted(() => {
  setTimeout(() => {
    if (visible.value) {
      close();
    }
  }, props.duration);
});
</script>