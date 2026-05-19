<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700">
      Choisissez votre pack
    </label>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="pack in packs"
        :key="pack.id"
        @click="selectPack(pack)"
        class="cursor-pointer"
      >
        <div
          class="border-2 rounded-lg p-4 transition-all hover:shadow-lg"
          :class="[
            selectedPack?.id === pack.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300'
          ]"
        >
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">
              {{ formatPrice(pack.price) }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              {{ pack.sms_count }} SMS
            </p>
            <div class="mt-2">
              <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {{ formatPrice(pack.price / pack.sms_count) }}/SMS
              </span>
            </div>
            <p v-if="pack.bonus" class="mt-2 text-xs text-primary-600">
              +{{ pack.bonus }} SMS offerts
            </p>
            <p v-if="pack.popular" class="mt-2 text-xs font-medium text-orange-600">
              ⭐ Le plus populaire
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const selectedPack = ref(props.modelValue);
const packs = ref([
  {
    id: 1,
    price: 1000,
    sms_count: 110,
    bonus: 10,
    popular: false
  },
  {
    id: 2,
    price: 5000,
    sms_count: 600,
    bonus: 100,
    popular: true
  },
  {
    id: 3,
    price: 10000,
    sms_count: 1300,
    bonus: 300,
    popular: false
  },
  {
    id: 4,
    price: 25000,
    sms_count: 3500,
    bonus: 1000,
    popular: false
  },
  {
    id: 5,
    price: 50000,
    sms_count: 7500,
    bonus: 2500,
    popular: false
  },
  {
    id: 6,
    price: 100000,
    sms_count: 16000,
    bonus: 6000,
    popular: false
  }
]);

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price);
};

const selectPack = (pack) => {
  selectedPack.value = pack;
  emit('update:modelValue', pack);
  emit('select', pack);
};

onMounted(() => {
  if (props.modelValue) {
    selectedPack.value = props.modelValue;
  }
});
</script>