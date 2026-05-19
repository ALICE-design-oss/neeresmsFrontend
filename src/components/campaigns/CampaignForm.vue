<template>
  <div class="space-y-6">
    <div class="bg-blue-50 p-3 rounded-lg mb-4">
      <p class="text-sm text-blue-800">
        📢 Les campagnes permettent de programmer des envois et de suivre les statistiques complètes.
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Nom de la campagne *</label>
      <input 
        v-model="form.name" 
        type="text" 
        class="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
        placeholder="Campagne promotionnelle"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Message *</label>
      <textarea 
        v-model="form.message" 
        rows="4" 
        class="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
        placeholder="Votre message..."
        @input="updateCost"
      ></textarea>
      <SmsCounter :message="form.message" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Sender ID</label>
      <input 
        v-model="form.sender_id" 
        type="text" 
        maxlength="11" 
        class="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
      />
    </div>

    <div>
      <label class="flex items-center">
        <input type="checkbox" v-model="form.schedule" class="h-4 w-4 text-primary-600 rounded" />
        <span class="ml-2 text-sm text-gray-700">Programmer l'envoi</span>
      </label>
    </div>

    <div v-if="form.schedule">
      <label class="block text-sm font-medium text-gray-700">Date et heure d'envoi</label>
      <input 
        v-model="form.scheduled_at" 
        type="datetime-local" 
        :min="minDateTime" 
        class="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Destinataires *</label>
      
      <!-- Choix du mode de saisie -->
      <div class="flex space-x-4 mb-4">
        <label class="flex items-center">
          <input type="radio" v-model="recipientType" value="upload" class="h-4 w-4 text-primary-600" />
          <span class="ml-2 text-sm text-gray-700">Importer un fichier</span>
        </label>
        <label class="flex items-center">
          <input type="radio" v-model="recipientType" value="manual" class="h-4 w-4 text-primary-600" />
          <span class="ml-2 text-sm text-gray-700">Saisie manuelle</span>
        </label>
      </div>

      <!-- Upload de fichier -->
      <div v-if="recipientType === 'upload'">
        <BulkSmsUpload
          @file-loaded="handleFileLoaded"
          @file-cleared="handleFileCleared"
        />
        <p class="mt-1 text-xs text-gray-500">
          Format : CSV ou Excel avec colonne "phone" (format international: +225XXXXXXXXX)
        </p>
      </div>

      <!-- Saisie manuelle -->
      <div v-else>
        <textarea
          v-model="manualRecipients"
          rows="5"
          placeholder="Saisissez les numéros un par ligne ou séparés par des virgules&#10;&#10;Format attendu (avec indicatif):&#10;+22507000000&#10;+22170000000&#10;+22670000000"
          class="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono"
          @input="parseManualNumbers"
        ></textarea>
        <div class="mt-2 flex justify-between items-center">
          <p class="text-xs text-gray-500">
            {{ manualRecipientsList.length }} destinataire(s) détecté(s)
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
    </div>

    <!-- Résumé du coût -->
    <div class="bg-gray-50 rounded-lg p-4">
      <h4 class="font-medium mb-2">Résumé de la campagne</h4>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span>Destinataires</span>
          <span class="font-bold">{{ totalRecipients }}</span>
        </div>
        <div class="flex justify-between">
          <span>SMS par destinataire</span>
          <span class="font-bold">{{ smsCount || 1 }}</span>
        </div>
        <div class="flex justify-between">
          <span>Total SMS</span>
          <span class="font-bold">{{ totalSmsCount }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Coût estimé</span>
          <span class="text-primary-600">{{ formatPrice(estimatedCost, 'XOF') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import SmsCounter from '../sms/SmsCounter.vue';
import BulkSmsUpload from '../sms/BulkSmsUpload.vue';

const emit = defineEmits(['submit']);

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

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
});

const form = ref({
  name: props.initialData.name || '',
  message: props.initialData.message || '',
  sender_id: props.initialData.sender_id || '',
  schedule: props.initialData.schedule || false,
  scheduled_at: props.initialData.scheduled_at || ''
});

const recipientType = ref('upload');
const uploadedRecipients = ref([]);
const manualRecipients = ref('');
const manualRecipientsList = ref([]);
const countryStats = ref([]);
const smsCount = ref(1);
const estimatedCost = ref(0);

const minDateTime = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
});

// Liste des destinataires
const recipientsList = computed(() => {
  if (recipientType.value === 'upload') {
    return uploadedRecipients.value;
  } else {
    return manualRecipientsList.value;
  }
});

const totalRecipients = computed(() => recipientsList.value.length);
const totalSmsCount = computed(() => totalRecipients.value * (smsCount.value || 1));

// Formater le prix
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

// Analyser les pays des destinataires
const analyzeCountries = () => {
  const stats = new Map();
  const invalidNumbers = [];
  
  for (const recipient of recipientsList.value) {
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
  
  countryStats.value = Array.from(stats.values()).sort((a, b) => b.count - a.count);
  updateCost();
};

// Parser les numéros saisis manuellement
const parseManualNumbers = () => {
  if (!manualRecipients.value.trim()) {
    manualRecipientsList.value = [];
    return;
  }
  
  const numbers = manualRecipients.value
    .split(/[,\n]/)
    .map(n => n.trim())
    .filter(n => n.length > 0);
  
  manualRecipientsList.value = numbers.map(phone => ({ phone }));
  analyzeCountries();
};

// Effacer les numéros saisis manuellement
const clearManualNumbers = () => {
  manualRecipients.value = '';
  manualRecipientsList.value = [];
  countryStats.value = [];
  estimatedCost.value = 0;
};

// Mettre à jour le coût
const updateCost = () => {
  if (!form.value.message || recipientsList.value.length === 0) {
    estimatedCost.value = 0;
    smsCount.value = 1;
    return;
  }
  
  // Calculer le nombre de SMS par message (160 caractères par SMS)
  const messageLength = form.value.message.length;
  const parts = Math.ceil(messageLength / 160);
  smsCount.value = parts;
  
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
  
  estimatedCost.value = Math.round(totalCost);
};

const handleFileLoaded = (fileRecipients) => {
  uploadedRecipients.value = fileRecipients;
  analyzeCountries();
};

const handleFileCleared = () => {
  uploadedRecipients.value = [];
  countryStats.value = [];
  estimatedCost.value = 0;
};

// Watchers
watch(() => form.value.message, () => {
  updateCost();
});

watch(() => recipientsList.value, () => {
  analyzeCountries();
}, { deep: true });

// Soumettre le formulaire
const submit = () => {
  if (!form.value.name.trim()) {
    alert('Veuillez saisir un nom de campagne');
    return;
  }
  
  if (!form.value.message.trim()) {
    alert('Veuillez saisir un message');
    return;
  }
  
  if (recipientsList.value.length === 0) {
    alert('Veuillez ajouter au moins un destinataire');
    return;
  }
  
  if (form.value.schedule && !form.value.scheduled_at) {
    alert('Veuillez choisir une date d\'envoi');
    return;
  }
  
  const campaignData = {
    ...form.value,
    recipients: recipientsList.value,
    total_recipients: totalRecipients.value,
    estimated_cost: estimatedCost.value,
    country_stats: countryStats.value
  };
  
  emit('submit', campaignData);
};

defineExpose({ submit });
</script>