<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700">
      Méthode de paiement
    </label>
    
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div
        v-for="method in methods"
        :key="method.id"
        @click="selectMethod(method)"
        class="cursor-pointer"
      >
        <div
          class="border-2 rounded-lg p-4 text-center transition-all"
          :class="[
            selectedMethod?.id === method.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300'
          ]"
        >
          <img
            v-if="method.icon"
            :src="method.icon"
            :alt="method.name"
            class="h-10 w-10 mx-auto mb-2"
          />
          <div
            v-else
            class="h-10 w-10 mx-auto mb-2 rounded-full flex items-center justify-center"
            :class="method.bgColor"
          >
            <component :is="method.iconComponent" class="h-6 w-6" :class="method.iconColor" />
          </div>
          <p class="text-sm font-medium" :class="selectedMethod?.id === method.id ? 'text-primary-700' : 'text-gray-700'">
            {{ method.name }}
          </p>
          <p v-if="method.commission" class="text-xs text-gray-500 mt-1">
            Frais: {{ method.commission }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const selectedMethod = ref(props.modelValue);
const methods = ref([
  {
    id: 'orange_money',
    name: 'Orange Money',
    iconComponent: DevicePhoneMobileIcon,
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-100',
    commission: 0,
    countries: ['CI', 'SN', 'ML', 'BF', 'CM', 'GN']
  },
  {
    id: 'mtn_money',
    name: 'MTN Money',
    iconComponent: DevicePhoneMobileIcon,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    commission: 0,
    countries: ['CI', 'CM', 'UG', 'RW']
  },
  {
    id: 'wave',
    name: 'Wave',
    iconComponent: BanknotesIcon,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-100',
    commission: 0,
    countries: ['SN', 'BF', 'CI', 'ML']
  },
  {
    id: 'card',
    name: 'Carte bancaire',
    iconComponent: CreditCardIcon,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
    commission: 2.5,
    countries: ['global']
  },
  {
    id: 'crypto',
    name: 'Crypto (USDT)',
    iconComponent: CurrencyDollarIcon,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-100',
    commission: 1,
    countries: ['global']
  },
  {
    id: 'stripe',
    name: 'Stripe',
    iconComponent: CreditCardIcon,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    commission: 2.9,
    countries: ['global']
  }
]);

const selectMethod = (method) => {
  selectedMethod.value = method;
  emit('update:modelValue', method);
  emit('select', method);
};

onMounted(() => {
  if (props.modelValue) {
    selectedMethod.value = props.modelValue;
  }
});
</script>