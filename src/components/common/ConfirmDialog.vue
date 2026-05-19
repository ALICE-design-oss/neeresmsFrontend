<template>
  <Modal
    :is-open="isOpen"
    :title="title"
    :message="message"
    :icon="icon"
    :icon-type="iconType"
    :show-confirm-button="true"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    @close="cancel"
    @confirm="confirm"
  />
</template>

<script setup>
import Modal from './Modal.vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmer l\'action'
  },
  message: {
    type: String,
    default: 'Êtes-vous sûr de vouloir effectuer cette action ?'
  },
  icon: {
    type: [Object, String],
    default: ExclamationTriangleIcon
  },
  iconType: {
    type: String,
    default: 'warning'
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

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>