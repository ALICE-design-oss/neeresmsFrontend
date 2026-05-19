<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">SMS en masse</h1>
        <p class="mt-1 text-sm text-gray-500">
          Envoyez des SMS à plusieurs destinataires via un fichier CSV ou une saisie manuelle
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Formulaire principal -->
      <div class="lg:col-span-2">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Envoi ponctuel</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
              <!-- Choix du mode de saisie -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mode de saisie des destinataires *
                </label>
                <div class="flex space-x-4">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="inputMode"
                      value="upload"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Importer un fichier</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="inputMode"
                      value="manual"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Saisie manuelle</span>
                  </label>
                </div>
              </div>

              <!-- Upload de fichier -->
              <div v-if="inputMode === 'upload'">
                <BulkSmsUpload
                  @file-loaded="handleFileLoaded"
                  @file-cleared="handleFileCleared"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Format : CSV ou Excel avec colonne "phone" (format : +226XXXXXXXX)
                </p>
              </div>

              <!-- Saisie manuelle -->
              <div v-if="inputMode === 'manual'">
                <label for="manual_numbers" class="block text-sm font-medium text-gray-700">
                  Numéros de téléphone *
                </label>
                <div class="mt-1">
                  <textarea
                    id="manual_numbers"
                    v-model="manualNumbers"
                    rows="6"
                    placeholder="Saisissez les numéros un par ligne ou séparés par des virgules&#10;&#10;Format attendu (avec indicatif):&#10;+22507000000&#10;+22170000000&#10;+22670000000&#10;&#10;Exemple:&#10;+22507000000,+22170000000,+22670000000"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono"
                    @input="parseManualNumbers"
                  ></textarea>
                </div>
                <div class="mt-2 flex justify-between items-center">
                  <p class="text-xs text-gray-500">
                    {{ manualRecipients.length }} destinataire(s) détecté(s)
                  </p>
                  <button
                    type="button"
                    @click="clearManualNumbers"
                    class="text-xs text-red-600 hover:text-red-700"
                  >
                    Effacer tout
                  </button>
                </div>
              </div>

              <!-- Résumé des pays détectés -->
              <div v-if="countryStats.length > 0" class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-700 mb-3">📊 Répartition par pays</h4>
                <div class="space-y-2">
                  <div 
                    v-for="stat in countryStats" 
                    :key="stat.country.code"
                    class="flex items-center justify-between text-sm"
                  >
                    <div class="flex items-center space-x-2">
                      <span class="text-lg">{{ stat.country.flag }}</span>
                      <span>{{ stat.country.name }}</span>
                      <span class="text-xs text-gray-500">({{ stat.country.dialCode }})</span>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span class="font-medium">{{ stat.count }} destinataires</span>
                      <span class="text-primary-600">{{ formatPrice(stat.country.price, stat.country.currency) }}/SMS</span>
                    </div>
                  </div>
                </div>
                <div class="mt-3 pt-3 border-t border-gray-200">
                  <div class="flex justify-between text-sm font-medium">
                    <span>Total destinataires</span>
                    <span>{{ totalRecipients }}</span>
                  </div>
                  <div class="flex justify-between text-sm font-medium mt-1">
                    <span>Coût total estimé</span>
                    <span class="text-primary-600">{{ formatPrice(totalEstimatedCost, 'XOF') }}</span>
                  </div>
                </div>
              </div>

              <!-- Message par défaut -->
              <div>
                <label for="default_message" class="block text-sm font-medium text-gray-700">
                  Message par défaut *
                </label>
                <div class="mt-1">
                  <textarea
                    id="default_message"
                    v-model="form.default_message"
                    rows="4"
                    required
                    placeholder="Votre message ici..."
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    @input="updateCost"
                  ></textarea>
                </div>
                <div class="mt-2 flex justify-between text-sm">
                  <span class="text-gray-500">{{ form.default_message.length }} / 160 caractères</span>
                  <span class="text-gray-500">{{ smsPerRecipient }} SMS par destinataire</span>
                </div>
              </div>

              <!-- Sender ID -->
              <div>
                <label for="sender_id" class="block text-sm font-medium text-gray-700">
                  Sender ID
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
        <!-- Résumé -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Résumé de l'envoi</h3>
          </div>
          <div class="card-body space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Destinataires</span>
              <span class="text-lg font-bold text-gray-900">{{ totalRecipients }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">SMS par destinataire</span>
              <span class="text-sm text-gray-900">{{ smsPerRecipient }} SMS</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Total SMS</span>
              <span class="text-lg font-bold text-gray-900">{{ totalSmsCount }}</span>
            </div>
            <div class="pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Coût estimé</span>
                <span class="text-xl font-bold" :class="costColorClass">
                  {{ formatPrice(totalEstimatedCost, 'XOF') }}
                </span>
              </div>
            </div>
            <div v-if="totalEstimatedCost > walletBalance" class="mt-4 p-3 bg-red-50 rounded-md">
              <p class="text-sm text-red-700">
                Solde insuffisant ! Besoin de {{ formatPrice(totalEstimatedCost - walletBalance, 'XOF') }}.
              </p>
              <router-link to="/wallet/packs" class="mt-2 inline-block text-sm text-primary-600">
                Recharger →
              </router-link>
            </div>
          </div>
        </div>

        <!-- Barre de progression -->
        <div v-if="loading" class="card mt-6">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Envoi en cours</h3>
          </div>
          <div class="card-body">
            <div class="mb-2 flex justify-between text-sm">
              <span>Progression</span>
              <span>{{ progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
            <p class="mt-2 text-xs text-gray-500 text-center">
              {{ sentCount }} / {{ totalRecipients }} SMS envoyés
            </p>
          </div>
        </div>

        <!-- Informations sur les indicatifs -->
        <div class="card mt-6">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Indicatifs acceptés</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div v-for="country in acceptedCountries" :key="country.code" class="flex items-center space-x-1">
                <span>{{ country.flag }}</span>
                <span class="font-mono">{{ country.dialCode }}</span>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-3">
              Les numéros doivent être au format avec l'indicatif.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useUserStore } from '../../store/user';
import Loader from '../common/Loader.vue';
import BulkSmsUpload from './BulkSmsUpload.vue';

const toast = useToast();
const userStore = useUserStore();

// États
const loading = ref(false);
const progress = ref(0);
const sentCount = ref(0);
const recipients = ref([]);
const walletBalance = ref(0);
const smsPerRecipient = ref(1);
const totalEstimatedCost = ref(0);
const countryStats = ref([]);
const inputMode = ref('upload'); 
const manualNumbers = ref('');
const manualRecipients = ref([]);

const form = reactive({
  default_message: '',
  sender_id: ''
});

// Liste des pays acceptés (uniquement ceux du fichier)
const acceptedCountries = [
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮', price: 9, currency: 'XOF' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳', price: 10, currency: 'XOF' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', price: 8, currency: 'XOF' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱', price: 9, currency: 'XOF' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬', price: 9, currency: 'XOF' },
  { code: 'BJ', name: 'Bénin', dialCode: '+229', flag: '🇧🇯', price: 9, currency: 'XOF' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪', price: 10, currency: 'XOF' },
  { code: 'GN', name: 'Guinée', dialCode: '+224', flag: '🇬🇳', price: 450, currency: 'GNF' },
  { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲', price: 9, currency: 'XAF' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦', price: 10, currency: 'XAF' },
  { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬', price: 10, currency: 'XAF' },
  { code: 'TD', name: 'Tchad', dialCode: '+235', flag: '🇹🇩', price: 11, currency: 'XAF' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', price: 0.039, currency: 'EUR' },
  { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪', price: 0.040, currency: 'EUR' },
  { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭', price: 0.045, currency: 'CHF' },
  { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸', price: 0.009, currency: 'USD' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', price: 0.012, currency: 'CAD' },
  { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦', price: 0.20, currency: 'MAD' }
];

// Computed
const totalRecipients = computed(() => recipients.value.length);
const totalSmsCount = computed(() => totalRecipients.value * smsPerRecipient.value);
const canSubmit = computed(() => totalRecipients.value > 0 && form.default_message && totalEstimatedCost.value <= walletBalance.value);
const costColorClass = computed(() => totalEstimatedCost.value > walletBalance.value ? 'text-red-600' : 'text-green-600');

// Fonctions
const formatPrice = (price, currency = 'XOF') => {
  if (!price && price !== 0) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'XOF' || currency === 'XAF' ? 0 : 2
  }).format(price);
};

// Détecter le pays à partir du numéro
const detectCountryFromPhone = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/[^0-9+]/g, '');
  
  for (const country of acceptedCountries) {
    if (cleaned.startsWith(country.dialCode)) {
      return country;
    }
  }
  return null;
};

// Parser les numéros saisis manuellement
const parseManualNumbers = () => {
  if (!manualNumbers.value.trim()) {
    manualRecipients.value = [];
    recipients.value = [];
    countryStats.value = [];
    return;
  }
  
  // Séparer par ligne ou par virgule
  const numbers = manualNumbers.value
    .split(/[,\n]/)
    .map(n => n.trim())
    .filter(n => n.length > 0);
  
  manualRecipients.value = numbers.map(phone => ({ phone }));
  recipients.value = manualRecipients.value;
  analyzeCountries();
};

// Effacer les numéros saisis manuellement
const clearManualNumbers = () => {
  manualNumbers.value = '';
  manualRecipients.value = [];
  recipients.value = [];
  countryStats.value = [];
  totalEstimatedCost.value = 0;
};

// Analyser les pays des destinataires
const analyzeCountries = () => {
  const stats = new Map();
  const invalidNumbers = [];
  
  for (const recipient of recipients.value) {
    const phone = recipient.phone;
    const country = detectCountryFromPhone(phone);
    
    if (country) {
      const key = country.code;
      if (stats.has(key)) {
        stats.get(key).count++;
      } else {
        stats.set(key, { country, count: 1 });
      }
    } else {
      invalidNumbers.push(phone);
    }
  }
  
  if (invalidNumbers.length > 0) {
    toast.warning(`${invalidNumbers.length} numéro(s) non reconnu(s) : ${invalidNumbers.slice(0, 3).join(', ')}${invalidNumbers.length > 3 ? '...' : ''}`);
  }
  
  countryStats.value = Array.from(stats.values()).sort((a, b) => b.count - a.count);
  
  // Mettre à jour le coût
  updateCost();
};

// Mettre à jour le coût
const updateCost = () => {
  if (!form.default_message || recipients.value.length === 0) {
    totalEstimatedCost.value = 0;
    smsPerRecipient.value = 1;
    return;
  }
  
  // Calculer le nombre de SMS par message (160 caractères par SMS)
  const messageLength = form.default_message.length;
  const parts = Math.ceil(messageLength / 160);
  smsPerRecipient.value = parts;
  
  // Calculer le coût total par pays
  let totalCost = 0;
  
  for (const stat of countryStats.value) {
    const country = stat.country;
    const recipientCount = stat.count;
    const costPerRecipient = country.price * parts;
    
    // Convertir en FCFA pour le total
    let costInXof = costPerRecipient;
    if (country.currency === 'EUR') costInXof = costPerRecipient * 655.957;
    if (country.currency === 'USD') costInXof = costPerRecipient * 600;
    if (country.currency === 'CHF') costInXof = costPerRecipient * 670;
    if (country.currency === 'CAD') costInXof = costPerRecipient * 440;
    if (country.currency === 'GNF') costInXof = costPerRecipient / 100;
    if (country.currency === 'XAF') costInXof = costPerRecipient;
    if (country.currency === 'MAD') costInXof = costPerRecipient * 60;
    
    totalCost += costInXof * recipientCount;
  }
  
  totalEstimatedCost.value = Math.round(totalCost);
};

const handleFileLoaded = (fileRecipients) => {
  inputMode.value = 'upload';
  recipients.value = fileRecipients;
  analyzeCountries();
};

const handleFileCleared = () => {
  recipients.value = [];
  countryStats.value = [];
  totalEstimatedCost.value = 0;
};

const handleSubmit = async () => {
  if (!canSubmit.value) {
    if (recipients.value.length === 0) {
      toast.error('Veuillez ajouter des destinataires (fichier ou saisie manuelle)');
    } else if (!form.default_message) {
      toast.error('Veuillez saisir un message');
    } else if (totalEstimatedCost.value > walletBalance.value) {
      toast.error('Solde insuffisant');
    }
    return;
  }
  
  loading.value = true;
  progress.value = 0;
  sentCount.value = 0;
  
  // Simulation d'envoi progressif
  const interval = setInterval(() => {
    if (sentCount.value < recipients.value.length) {
      sentCount.value++;
      progress.value = Math.floor((sentCount.value / recipients.value.length) * 100);
    } else {
      clearInterval(interval);
      loading.value = false;
      
      // Afficher le résumé par pays
      let summary = '';
      for (const stat of countryStats.value) {
        summary += `${stat.country.flag} ${stat.country.name}: ${stat.count} SMS\n`;
      }
      
      toast.success(`${recipients.value.length} SMS envoyés avec succès !\n${summary}`);
      resetForm();
    }
  }, 50);
};

const resetForm = () => {
  form.default_message = '';
  form.sender_id = '';
  recipients.value = [];
  countryStats.value = [];
  totalEstimatedCost.value = 0;
  progress.value = 0;
  sentCount.value = 0;
  manualNumbers.value = '';
  manualRecipients.value = [];
  inputMode.value = 'upload';
};

const loadBalance = () => {
  walletBalance.value = userStore.user?.wallet_balance || 45500;
};

onMounted(() => {
  loadBalance();
});
</script>