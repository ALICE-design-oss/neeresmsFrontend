<template>
  <!-- Mobile sidebar -->
  <transition enter-active-class="transition-opacity ease-linear duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity ease-linear duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isOpen" class="fixed inset-0 flex z-40 lg:hidden" @click.self="close">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
      <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div class="absolute top-0 right-0 -mr-12 pt-2">
          <button @click="close" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="sr-only">Fermer le menu</span>
            <XMarkIcon class="h-6 w-6 text-white" />
          </button>
        </div>
        <SidebarContent />
      </div>
    </div>
  </transition>

  <!-- Desktop sidebar -->
  <div class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
    <SidebarContent />
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';
import SidebarContent from './SidebarContent.vue';

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>