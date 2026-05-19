<template>
  <div class="relative">
    <button
      type="button"
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      :class="{ 'border-primary-500 ring-1 ring-primary-500': isOpen }"
    >
      <span class="text-xl">{{ selectedCountry.flag }}</span>
      <span class="font-medium">{{ selectedCountry.dialCode }}</span>
      <ChevronDownIcon class="h-4 w-4 text-gray-400" />
    </button>

    <!-- Dropdown des pays -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
    >
      <div class="sticky top-0 bg-white p-2 border-b border-gray-200">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Rechercher un pays..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div class="p-2">
        <button
          v-for="country in filteredCountries"
          :key="country.code"
          @click="selectCountry(country)"
          class="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
        >
          <span class="text-xl">{{ country.flag }}</span>
          <div class="flex-1 text-left">
            <p class="text-sm font-medium text-gray-900">{{ country.name }}</p>
            <p class="text-xs text-gray-500">{{ country.dialCode }}</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const isOpen = ref(false);
const searchTerm = ref('');

const countries = [
  // Afrique de l'Ouest
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮', currency: 'XOF', price: 9 },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳', currency: 'XOF', price: 10 },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', currency: 'XOF', price: 8 },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱', currency: 'XOF', price: 9 },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬', currency: 'XOF', price: 9 },
  { code: 'BJ', name: 'Bénin', dialCode: '+229', flag: '🇧🇯', currency: 'XOF', price: 9 },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪', currency: 'XOF', price: 10 },
  { code: 'GN', name: 'Guinée', dialCode: '+224', flag: '🇬🇳', currency: 'GNF', price: 450 },
  
  // Afrique centrale
  { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲', currency: 'XAF', price: 9 },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦', currency: 'XAF', price: 10 },
  { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬', currency: 'XAF', price: 10 },
  { code: 'CD', name: 'RDC', dialCode: '+243', flag: '🇨🇩', currency: 'CDF', price: 350 },
  { code: 'TD', name: 'Tchad', dialCode: '+235', flag: '🇹🇩', currency: 'XAF', price: 11 },
  
  // Europe
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', currency: 'EUR', price: 0.039 },
  { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪', currency: 'EUR', price: 0.040 },
  { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭', currency: 'CHF', price: 0.045 },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺', currency: 'EUR', price: 0.042 },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧', currency: 'GBP', price: 0.058 },
  { code: 'DE', name: 'Allemagne', dialCode: '+49', flag: '🇩🇪', currency: 'EUR', price: 0.052 },
  { code: 'IT', name: 'Italie', dialCode: '+39', flag: '🇮🇹', currency: 'EUR', price: 0.050 },
  { code: 'ES', name: 'Espagne', dialCode: '+34', flag: '🇪🇸', currency: 'EUR', price: 0.048 },
  
  // Amérique
  { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸', currency: 'USD', price: 0.009 },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', currency: 'CAD', price: 0.012 },
  
  // Asie
  { code: 'IN', name: 'Inde', dialCode: '+91', flag: '🇮🇳', currency: 'INR', price: 0.50 },
  { code: 'CN', name: 'Chine', dialCode: '+86', flag: '🇨🇳', currency: 'CNY', price: 0.35 },
  
  // Moyen-Orient
  { code: 'AE', name: 'EAU', dialCode: '+971', flag: '🇦🇪', currency: 'AED', price: 0.30 },
  { code: 'SA', name: 'Arabie Saoudite', dialCode: '+966', flag: '🇸🇦', currency: 'SAR', price: 0.35 }
];

const selectedCountry = ref(props.modelValue || countries[2]); // Burkina Faso par défaut

const filteredCountries = computed(() => {
  if (!searchTerm.value) return countries;
  const term = searchTerm.value.toLowerCase();
  return countries.filter(c => 
    c.name.toLowerCase().includes(term) || 
    c.dialCode.includes(term)
  );
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectCountry = (country) => {
  selectedCountry.value = country;
  isOpen.value = false;
  searchTerm.value = '';
  emit('update:modelValue', country);
  emit('select', country);
};

// Exposer pour le parent
defineExpose({ selectedCountry });
</script>