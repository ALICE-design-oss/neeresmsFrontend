
<template>
  <div class="space-y-4">
    <!-- Zone d'upload -->
    <div
      class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
      :class="{
        'border-gray-300 hover:border-primary-500': !isDragging,
        'border-primary-500 bg-primary-50': isDragging
      }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".csv,.xlsx,.xls"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <DocumentArrowUpIcon class="mx-auto h-12 w-12 text-gray-400" />
      <p class="mt-2 text-sm text-gray-600">
        Glissez-déposez votre fichier ici ou
        <span class="text-primary-600 hover:text-primary-500">parcourez</span>
      </p>
      <p class="mt-1 text-xs text-gray-500">
        Formats acceptés : CSV, Excel (max 10 000 lignes)
      </p>
    </div>

    <!-- Aperçu du fichier -->
    <div v-if="fileData" class="bg-gray-50 rounded-lg p-4">
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-sm font-medium text-gray-900">Aperçu du fichier</h4>
        <button @click="clearFile" class="text-red-600 hover:text-red-700 text-sm">
          Supprimer
        </button>
      </div>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-white rounded p-3">
          <p class="text-xs text-gray-500">Fichier</p>
          <p class="text-sm font-medium text-gray-900">{{ fileData.name }}</p>
        </div>
        <div class="bg-white rounded p-3">
          <p class="text-xs text-gray-500">Destinataires</p>
          <p class="text-sm font-medium text-gray-900">{{ fileData.recipients.length }}</p>
        </div>
      </div>
      
      <!-- Tableau d'aperçu -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">N°</th>
              <th class="px-4 py-2 text-left">Numéro</th>
              <th class="px-4 py-2 text-left">Message</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(recipient, index) in fileData.recipients.slice(0, 5)" :key="index">
              <td class="px-4 py-2">{{ index + 1 }}</td>
              <td class="px-4 py-2">{{ recipient.phone }}</td>
              <td class="px-4 py-2 truncate max-w-xs">{{ recipient.message || 'Message par défaut' }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="fileData.recipients.length > 5" class="mt-2 text-xs text-gray-500 text-center">
          + {{ fileData.recipients.length - 5 }} autres destinataires
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DocumentArrowUpIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['file-loaded', 'file-cleared']);

const fileInput = ref(null);
const isDragging = ref(false);
const fileData = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleDrop = (e) => {
  isDragging.value = false;
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
};

const handleFileSelect = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
};

const processFile = async (file) => {
  // Simuler la lecture du fichier
  const recipients = [
    { phone: '+225 07 00 00 01', message: '' },
    { phone: '+225 07 00 00 02', message: '' },
    { phone: '+225 07 00 00 03', message: '' }
  ];
  
  fileData.value = {
    name: file.name,
    recipients: recipients
  };
  
  emit('file-loaded', recipients);
};

const clearFile = () => {
  fileData.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  emit('file-cleared');
};
</script>