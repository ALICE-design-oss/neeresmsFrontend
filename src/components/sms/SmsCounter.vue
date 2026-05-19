<template>
  <div class="mt-2 flex justify-between items-center text-sm">
    <div class="text-gray-500">
      <span :class="{ 'text-red-500': characterCount > 160 }">
        {{ characterCount }}
      </span>
      / {{ maxLength }} caractères
    </div>
    <div class="text-gray-500">
      {{ smsCount }} SMS
      <span v-if="smsCount > 1" class="text-xs text-gray-400">
        ({{ characterCount }} caractères)
      </span>
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
  encoding: {
    type: String,
    default: 'gsm',
    validator: (value) => ['gsm', 'unicode'].includes(value)
  }
});

const maxLength = computed(() => {
  // GSM 7-bit: 160 caractères par SMS, 153 pour les SMS concaténés
  // Unicode: 70 caractères par SMS, 67 pour les SMS concaténés
  return props.encoding === 'gsm' ? 160 : 70;
});

const characterCount = computed(() => {
  if (props.encoding === 'gsm') {
    // Compter les caractères GSM (simplifié)
    return props.message.length;
  }
  return props.message.length;
});

const smsCount = computed(() => {
  if (characterCount.value === 0) return 0;
  
  const maxPerSms = maxLength.value;
  const parts = Math.ceil(characterCount.value / maxPerSms);
  
  // Pour les SMS concaténés, on perd quelques caractères pour l'en-tête
  if (parts > 1) {
    const headerLength = 7; // 6-7 caractères pour l'en-tête UDH
    const effectiveMax = maxPerSms - headerLength;
    return Math.ceil(characterCount.value / effectiveMax);
  }
  
  return parts;
});
</script>