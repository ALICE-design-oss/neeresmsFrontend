<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900">Tarifs SMS par pays</h1>
      <p class="mt-2 text-gray-600">Des prix transparents selon votre destination</p>
      <div class="mt-4 flex justify-center space-x-4">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
          <span class="text-sm">Hub2 (Afrique)</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <span class="text-sm">SMSPartner (Europe)</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 rounded-full bg-purple-500"></div>
          <span class="text-sm">Infobip (International)</span>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="card">
      <div class="card-body">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Rechercher un pays..."
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <select v-model="regionFilter" class="px-3 py-2 border rounded-md text-sm">
            <option value="">Toutes les régions</option>
            <option value="afrique">🌍 Afrique</option>
            <option value="europe">🇪🇺 Europe</option>
            <option value="amerique">🌎 Amérique</option>
            <option value="asie">🌏 Asie</option>
          </select>
          <select v-model="providerFilter" class="px-3 py-2 border rounded-md text-sm">
            <option value="">Tous les fournisseurs</option>
            <option value="Hub2">Hub2</option>
            <option value="SMSPartner">SMSPartner</option>
            <option value="Infobip">Infobip</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tableau des tarifs -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pays</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Devise</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coût (revient)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix public</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marge</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fournisseurs</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="price in filteredPrices" :key="price.code" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-xl mr-2">{{ price.flag }}</span>
                  <span class="font-medium text-gray-900">{{ price.country }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {{ price.code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ price.currency }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">
                  {{ formatPrice(price.cheapestProvider?.cost || 0, price.currency) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-lg font-bold text-primary-600">
                  {{ formatPrice(price.cheapestProvider?.sellingPrice || 0, price.currency) }}
                </span>
                <span class="text-xs text-gray-500">/ SMS</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getMarginClass(price.cheapestProvider?.margin)"
                >
                  +{{ price.cheapestProvider?.margin || 0 }}%
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-1">
                  <span
                    v-for="provider in price.providers"
                    :key="provider.provider"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    :class="getProviderClass(provider.provider)"
                  >
                    {{ provider.provider }}
                    <span class="ml-1 text-xs opacity-75">
                      ({{ formatPrice(provider.sellingPrice, price.currency) }})
                    </span>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Packs prépayés -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Packs prépayés avec bonus</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-for="pack in prepaidPacks" :key="pack.name" class="border rounded-lg p-4 text-center">
            <h4 class="font-bold text-gray-900">{{ pack.name }}</h4>
            <p class="text-2xl font-bold text-primary-600 mt-2">{{ formatPrice(pack.price, 'XOF') }}</p>
            <p class="text-sm text-gray-500">{{ pack.credits }} SMS</p>
            <p class="text-xs text-green-600 mt-1">+{{ pack.bonus }}% de bonus</p>
            <p class="text-xs text-gray-400 mt-1">{{ pack.price / pack.credits }}/SMS</p>
            <button @click="selectPack(pack)" class="mt-3 w-full btn-primary text-sm py-2">Choisir</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Programme revendeur -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Programme revendeur</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="level in resellerLevels" :key="level.name" class="border rounded-lg p-4" :class="level.borderClass">
            <div class="text-center">
              <span class="text-3xl">{{ level.icon }}</span>
              <h4 class="text-xl font-bold mt-2" :class="level.color">{{ level.name }}</h4>
              <p class="text-sm text-gray-500 mt-1">{{ level.minVolume }}</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">{{ level.commission }}%</p>
              <p class="text-xs text-gray-500">de commission</p>
              <ul class="mt-3 text-xs text-gray-600 space-y-1 text-left">
                <li v-for="feature in level.features" :key="feature">✓ {{ feature }}</li>
              </ul>
              <button class="mt-3 w-full btn-secondary text-sm py-2">Devenir revendeur</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Note d'information -->
    <div class="bg-blue-50 rounded-lg p-4">
      <div class="flex">
        <InformationCircleIcon class="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
        <div class="text-sm text-blue-700">
          <p><strong>Note :</strong> Les tarifs sont donnés à titre indicatif et peuvent varier selon le fournisseur utilisé.</p>
          <p class="mt-1">Le système choisit automatiquement le fournisseur le plus avantageux pour chaque destination (stratégie "least cost routing").</p>
          <p class="mt-1">En cas d'échec d'un fournisseur, un basculement automatique (failover) est effectué vers le prochain fournisseur disponible.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { InformationCircleIcon } from '@heroicons/vue/24/outline';
import pricingService from '../services/pricing';

const router = useRouter();
const toast = useToast();

const searchTerm = ref('');
const regionFilter = ref('');
const providerFilter = ref('');

const regionMapping = {
  afrique: ['CI', 'SN', 'BF', 'ML', 'TG', 'BJ', 'NE', 'GN', 'CM', 'GA', 'CG', 'TD', 'MA', 'TN', 'DZ'],
  europe: ['FR', 'BE', 'CH', 'GB', 'DE', 'IT', 'ES'],
  amerique: ['US', 'CA'],
  asie: []
};

const prepaidPacks = [
  { name: 'Starter', price: 5000, credits: 600, bonus: 8 },
  { name: 'Business', price: 25000, credits: 3200, bonus: 15 },
  { name: 'Enterprise', price: 100000, credits: 14000, bonus: 26 },
  { name: 'Revendeur', price: 500000, credits: 75000, bonus: 35 }
];

const resellerLevels = [
  { 
    name: 'Bronze', icon: '🥉', minVolume: '100.000 FCFA/mois', commission: 15,
    color: 'text-amber-700', borderClass: 'border-amber-200',
    features: ['Commission 15%', 'Prix d\'achat -25%', 'Dashboard dédié']
  },
  { 
    name: 'Silver', icon: '🥈', minVolume: '500.000 FCFA/mois', commission: 20,
    color: 'text-gray-500', borderClass: 'border-gray-300',
    features: ['Commission 20%', 'Prix d\'achat -35%', 'Dashboard whitelabel']
  },
  { 
    name: 'Gold', icon: '🥇', minVolume: '2.000.000 FCFA/mois', commission: 25,
    color: 'text-yellow-600', borderClass: 'border-yellow-400',
    features: ['Commission 25%', 'Prix d\'achat -45%', 'API marque blanche', 'Support 24/7']
  }
];

const allPrices = computed(() => pricingService.getAllPricing());

const filteredPrices = computed(() => {
  let prices = [...allPrices.value];
  
  if (regionFilter.value && regionMapping[regionFilter.value]) {
    prices = prices.filter(p => regionMapping[regionFilter.value].includes(p.code));
  }
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    prices = prices.filter(p => 
      p.country.toLowerCase().includes(term) || 
      p.code.toLowerCase().includes(term)
    );
  }
  
  if (providerFilter.value) {
    prices = prices.filter(p => 
      p.providers.some(prov => prov.provider === providerFilter.value)
    );
  }
  
  return prices;
});

const formatPrice = (price, currency) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'XOF' || currency === 'XAF' ? 0 : 2
  }).format(price);
};

const getMarginClass = (margin) => {
  const m = parseFloat(margin);
  if (m >= 120) return 'bg-green-100 text-green-800';
  if (m >= 100) return 'bg-green-50 text-green-700';
  if (m >= 80) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
};

const getProviderClass = (provider) => {
  const classes = {
    Hub2: 'bg-green-100 text-green-800',
    SMSPartner: 'bg-blue-100 text-blue-800',
    Infobip: 'bg-purple-100 text-purple-800'
  };
  return classes[provider] || 'bg-gray-100 text-gray-800';
};

const selectPack = (pack) => {
  toast.info(`Pack ${pack.name} sélectionné`);
  router.push('/wallet/packs');
};
</script>