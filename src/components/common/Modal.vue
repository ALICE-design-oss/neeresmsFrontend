<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="close"
        ></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                v-if="icon"
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                :class="iconBgClass"
              >
                <component :is="icon" class="h-6 w-6" :class="iconColorClass" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <slot>
                    <p class="text-sm text-gray-500">{{ message }}</p>
                  </slot>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <slot name="actions">
              <button
                v-if="showConfirmButton"
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
                :class="confirmButtonClass"
                @click="confirm"
              >
                {{ confirmText }}
              </button>
              <button
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="close"
              >
                {{ cancelText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  icon: {
    type: [Object, String],
    default: null
  },
  iconType: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'danger'].includes(value)
  },
  showConfirmButton: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  }
});

const emit = defineEmits(['close', 'confirm']);

const iconBgClass = computed(() => {
  switch (props.iconType) {
    case 'success':
      return 'bg-green-100';
    case 'warning':
      return 'bg-yellow-100';
    case 'danger':
      return 'bg-red-100';
    default:
      return 'bg-blue-100';
  }
});

const iconColorClass = computed(() => {
  switch (props.iconType) {
    case 'success':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'danger':
      return 'text-red-600';
    default:
      return 'text-blue-600';
  }
});

const confirmButtonClass = computed(() => {
  switch (props.iconType) {
    case 'success':
      return 'bg-green-600 hover:bg-green-700';
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700';
    default:
      return 'bg-primary-600 hover:bg-primary-700';
  }
});

const close = () => {
  emit('close');
};

const confirm = () => {
  emit('confirm');
};
</script>