<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Envoyer un SMS</h1>
        <p class="mt-1 text-sm text-gray-500">
          Envoyez un SMS simple - Sélectionnez le pays du destinataire
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Formulaire principal -->
      <div class="lg:col-span-2">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Formulaire d'envoi</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
              <!-- Pays du destinataire -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Pays du destinataire *
                </label>
                <div class="flex items-center space-x-3">
                  <CountrySelector 
                    v-model="selectedCountry" 
                    @select="onCountrySelect"
                    ref="countrySelectorRef"
                  />
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 text-sm text-gray-600">
                      <span class="font-medium">Indicatif:</span>
                      <span class="font-mono text-primary-600">{{ selectedCountry.dialCode }}</span>
                      <span class="text-gray-400">|</span>
                      <span>Tarif: {{ formatPrice(selectedCountry.price, getCurrencyForCountry(selectedCountry.code)) }}/SMS</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Numéro du destinataire (sans indicatif) -->
              <div>
                <label for="recipient" class="block text-sm font-medium text-gray-700">
                  Numéro du destinataire *
                </label>
                <div class="mt-1">
                  <div class="flex">
                    <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      {{ selectedCountry.dialCode }}
                    </span>
                    <input
                      id="recipient"
                      v-model="form.recipient"
                      type="tel"
                      @input="updateFullNumber"
                      class="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="70 00 00 00"
                    />
                  </div>
                </div>
                <p class="mt-1 text-xs text-gray-500">
                  Saisissez le numéro sans l'indicatif (ex: 70 00 00 00)
                </p>
              </div>

              <!-- Sender ID -->
              <div>
                <label for="sender_id" class="block text-sm font-medium text-gray-700">
                  Sender ID (Nom affiché)
                </label>
                <div class="mt-1">
                  <input
                    id="sender_id"
                    v-model="form.sender_id"
                    type="text"
                    maxlength="11"
                    placeholder="NeereSMS"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700">
                  Message *
                </label>
                <div class="mt-1">
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="5"
                    placeholder="Votre message ici..."
                    @input="calculateCost"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  ></textarea>
                </div>
                <div class="mt-2 flex justify-between text-sm">
                  <span class="text-gray-500">
                    {{ form.message.length }} / 160 caractères
                  </span>
                  <span class="text-gray-500">
                    {{ smsCount }} SMS
                  </span>
                </div>
              </div>

              <!-- Boutons -->
              <div class="flex justify-end space-x-3">
                <button type="button" @click="resetForm" class="btn-secondary">
                  Réinitialiser
                </button>
                <button type="submit" :disabled="loading || !canSubmit" class="btn-primary">
                  <Loader v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
                  {{ loading ? 'Envoi en cours...' : 'Envoyer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Panneau d'information -->
      <div class="lg:col-span-1">
        <!-- Détails du coût -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Détails du coût</h3>
          </div>
          <div class="card-body space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Pays de destination</span>
              <span class="text-sm font-medium">
                {{ selectedCountry.flag }} {{ selectedCountry.name }}
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Tarif par SMS</span>
              <span class="text-sm font-medium">
                {{ formatPrice(selectedCountry.price, getCurrencyForCountry(selectedCountry.code)) }}
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Nombre de SMS</span>
              <span class="text-sm font-medium">{{ smsCount }}</span>
            </div>
            
            <div class="pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700">Coût estimé</span>
                <span class="text-xl font-bold text-primary-600">
                  {{ formatPrice(estimatedCost, getCurrencyForCountry(selectedCountry.code)) }}
                </span>
              </div>
            </div>
            
            <!-- Fournisseurs disponibles -->
            <div class="pt-4 border-t border-gray-200">
              <p class="text-xs text-gray-500 mb-2">Fournisseurs disponibles :</p>
              <div class="space-y-2">
                <div 
                  v-for="provider in availableProviders" 
                  :key="provider.provider"
                  class="flex justify-between items-center text-xs p-2 rounded"
                  :class="provider.provider === cheapestProvider?.provider ? 'bg-green-50' : 'bg-gray-50'"
                >
                  <div class="flex items-center space-x-2">
                    <span :class="getProviderDotClass(provider.provider)" class="w-2 h-2 rounded-full"></span>
                    <span>{{ provider.provider }}</span>
                    <span v-if="provider.provider === cheapestProvider?.provider" class="text-green-600 text-xs font-medium">(Meilleur prix)</span>
                  </div>
                  <div class="font-mono">
                    <span>{{ formatPrice(provider.sellingPrice, getCurrencyForCountry(selectedCountry.code)) }}</span>
                    <span class="text-gray-400 text-xs ml-1">/SMS</span>
                  </div>
                </div>
              </div>
              <p class="text-xs text-green-600 mt-2">
                ✓ Routage intelligent : sélection automatique du meilleur fournisseur
              </p>
              <p class="text-xs text-blue-600 mt-1">
                🔄 Failover automatique en cas d'échec
              </p>
            </div>
          </div>
        </div>

        <!-- Solde -->
        <div class="card mt-6">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Solde disponible</h3>
          </div>
          <div class="card-body">
            <p class="text-2xl font-bold text-gray-900">{{ formatPrice(walletBalance, 'XOF') }}</p>
            <div v-if="estimatedCost > walletBalance" class="mt-4 p-3 bg-red-50 rounded-md">
              <p class="text-sm text-red-700">
                Solde insuffisant ! Besoin de {{ formatPrice(estimatedCost - walletBalance, 'XOF') }} supplémentaires.
              </p>
              <router-link to="/wallet/packs" class="mt-2 inline-block text-sm text-primary-600">
                Recharger maintenant →
              </router-link>
            </div>
          </div>
        </div>

        <!-- Aperçu du message -->
        <div class="card mt-6">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Aperçu</h3>
          </div>
          <div class="card-body">
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-500">De: {{ form.sender_id || 'NeereSMS' }}</p>
              <p class="text-sm text-gray-500 mt-1">À: {{ fullNumber || '---' }}</p>
              <div class="mt-3 pt-3 border-t border-gray-200">
                <p class="text-gray-800 whitespace-pre-wrap">{{ form.message || 'Message vide' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useUserStore } from '../../store/user';
import Loader from '../common/Loader.vue';
import CountrySelector from '../common/CountrySelector.vue';
import pricingService from '../../services/pricing';

const toast = useToast();
const userStore = useUserStore();

// États - Valeurs initialisées à 0
const loading = ref(false);
const walletBalance = ref(0);
const selectedCountry = ref({
  code: 'BF',
  name: 'Burkina Faso',
  dialCode: '+226',
  flag: '🇧🇫',
  currency: 'XOF',
  price: 8
});
const smsCount = ref(0);
const estimatedCost = ref(0);
const fullNumber = ref('');
const availableProviders = ref([]);
const cheapestProvider = ref(null);

const form = reactive({
  recipient: '',
  sender_id: '',
  message: '',
});

// Computed
const canSubmit = computed(() => {
  return form.recipient && form.message && estimatedCost.value <= walletBalance.value;
});

// Méthodes
const formatPrice = (price, currency = 'XOF') => {
  if (!price && price !== 0) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'XOF' || currency === 'XAF' ? 0 : 2
  }).format(price);
};

const getCurrencyForCountry = (code) => {
  const currencies = {
    'CI': 'XOF', 'SN': 'XOF', 'BF': 'XOF', 'ML': 'XOF', 'TG': 'XOF', 'BJ': 'XOF', 'NE': 'XOF', 'GN': 'GNF',
    'CM': 'XAF', 'GA': 'XAF', 'CG': 'XAF', 'TD': 'XAF',
    'FR': 'EUR', 'BE': 'EUR', 'CH': 'CHF',
    'US': 'USD', 'CA': 'CAD',
    'MA': 'MAD'
  };
  return currencies[code] || 'XOF';
};

const updateFullNumber = () => {
  if (form.recipient) {
    const cleanNumber = form.recipient.replace(/[^0-9]/g, '');
    fullNumber.value = `${selectedCountry.value.dialCode} ${cleanNumber}`;
  } else {
    fullNumber.value = '';
  }
  calculateCost();
};

const calculateCost = async () => {
  if (!form.message || !form.recipient) {
    smsCount.value = 0;
    estimatedCost.value = 0;
    availableProviders.value = [];
    cheapestProvider.value = null;
    return;
  }
  
  try {
    // Appel API réel pour calculer le coût
    const response = await smsService.calculateCost(fullNumber.value, form.message);
    smsCount.value = response.sms_count || 0;
    estimatedCost.value = response.total_cost || 0;
    availableProviders.value = response.providers || [];
    cheapestProvider.value = response.cheapest_provider || null;
  } catch (error) {
    console.error('Error calculating cost:', error);
    smsCount.value = 0;
    estimatedCost.value = 0;
  }
};

const onCountrySelect = (country) => {
  selectedCountry.value = country;
  updateFullNumber();
  calculateCost();
};

const handleSubmit = async () => {
  if (!form.recipient || !form.message) {
    toast.error('Veuillez remplir tous les champs');
    return;
  }
  
  if (estimatedCost.value > walletBalance.value) {
    toast.error('Solde insuffisant');
    return;
  }
  
  loading.value = true;
  
  try {
    // Appel API réel pour envoyer le SMS
    const response = await pricingService.sendSms({
      to: fullNumber.value,
      message: form.message,
      sender_id: form.sender_id || 'NeereSMS'
    });
    
    toast.success(response.message || 'SMS envoyé avec succès !');
    
    // Mettre à jour le solde après envoi
    if (response.new_balance !== undefined) {
      walletBalance.value = response.new_balance;
    }
    
    resetForm();
  } catch (error) {
    console.error('Send SMS error:', error);
    toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi du SMS');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.recipient = '';
  form.sender_id = '';
  form.message = '';
  fullNumber.value = '';
  smsCount.value = 0;
  estimatedCost.value = 0;
  availableProviders.value = [];
  cheapestProvider.value = null;
};

const getProviderDotClass = (provider) => {
  const classes = {
    Hub2: 'bg-green-500',
    SMSPartner: 'bg-blue-500',
    Infobip: 'bg-purple-500'
  };
  return classes[provider] || 'bg-gray-500';
};

// Charger le solde depuis le backend
const loadBalance = async () => {
  try {
    const { walletService } = await import('../../services/wallet');
    const balance = await walletService.getBalance();
    walletBalance.value = balance.amount || 0;
  } catch (error) {
    console.error('Error loading balance:', error);
    walletBalance.value = 0;
  }
};

// Watchers
watch(() => form.message, () => {
  calculateCost();
});

watch(() => form.recipient, () => {
  updateFullNumber();
});

// Initialisation
loadBalance();
</script>