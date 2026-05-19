<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- En-tête avec progression -->
      <div class="p-6 text-center">
        <div v-if="status === 'processing'" class="animate-pulse">
          <div class="h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <ClockIcon class="h-10 w-10 text-yellow-600" />
          </div>
          <h2 class="text-xl font-semibold mt-4">Traitement en cours</h2>
          <p class="text-gray-500 mt-2">Votre paiement est en cours de traitement...</p>
          
          <!-- Barre de progression -->
          <div class="mt-6">
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>Initialisation</span>
              <span>Vérification</span>
              <span>Confirmation</span>
              <span>Crédit</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-primary-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div v-else-if="status === 'success'" class="animate-fade-in">
          <div class="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircleIcon class="h-10 w-10 text-green-600" />
          </div>
          <h2 class="text-xl font-semibold mt-4">Paiement confirmé !</h2>
          <p class="text-gray-500 mt-2">
            Votre compte a été crédité de 
            <strong class="text-primary-600">{{ formatPrice(amount) }}</strong>
          </p>
          <p class="text-sm text-gray-400 mt-1">
            Transaction: <span class="font-mono">{{ transactionId }}</span>
          </p>
          
          <div class="mt-6 bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Pack</span>
              <span class="font-medium">{{ packName }}</span>
            </div>
            <div class="flex justify-between text-sm mt-2">
              <span class="text-gray-500">SMS crédités</span>
              <span class="font-medium">{{ formatNumber(smsCount) }} SMS</span>
            </div>
            <div class="flex justify-between text-sm mt-2">
              <span class="text-gray-500">Méthode</span>
              <span class="font-medium">{{ paymentMethod }}</span>
            </div>
          </div>
          
          <div class="mt-6 flex space-x-3">
            <button @click="goToWallet" class="flex-1 btn-primary">
              Voir mon wallet
            </button>
            <button @click="goToDashboard" class="flex-1 btn-secondary">
              Retour au dashboard
            </button>
          </div>
        </div>

        <div v-else class="animate-fade-in">
          <div class="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircleIcon class="h-10 w-10 text-red-600" />
          </div>
          <h2 class="text-xl font-semibold mt-4">Paiement échoué</h2>
          <p class="text-gray-500 mt-2">{{ errorMessage }}</p>
          
          <div class="mt-6 space-y-3">
            <button @click="retryPayment" class="w-full btn-primary">
              <ArrowPathIcon class="h-5 w-5 mr-2" />
              Réessayer
            </button>
            <button @click="changeMethod" class="w-full btn-secondary">
              Changer de méthode de paiement
            </button>
          </div>
        </div>
      </div>
      
      <!-- Pied de page -->
      <div class="bg-gray-50 px-6 py-4 text-center">
        <p class="text-xs text-gray-500">
          Une confirmation a été envoyée à votre adresse email.
          En cas de problème, contactez le support.
        </p>
        <router-link to="/support" class="text-xs text-primary-600 hover:text-primary-500 mt-1 inline-block">
          Contacter le support →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const toast = useToast();

// États
const status = ref('processing');
const progress = ref(0);
const amount = ref(0);
const transactionId = ref('');
const packName = ref('');
const smsCount = ref(0);
const paymentMethod = ref('');
const errorMessage = ref('');

let progressInterval = null;

// Fonctions
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

const simulateProgress = () => {
  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 10;
    } else {
      clearInterval(progressInterval);
      // Simuler un succès après 100%
      setTimeout(() => {
        status.value = 'success';
      }, 500);
    }
  }, 500);
};

const goToWallet = () => {
  router.push('/wallet');
};

const goToDashboard = () => {
  router.push('/dashboard');
};

const retryPayment = () => {
  // Rediriger vers la page de paiement
  router.push('/wallet/packs');
};

const changeMethod = () => {
  router.push('/wallet');
};

// Récupérer les paramètres de la transaction
onMounted(() => {
  const params = route.query;
  amount.value = parseFloat(params.amount) || 25000;
  transactionId.value = params.transaction_id || 'TXN' + Date.now();
  packName.value = params.pack || 'Business';
  smsCount.value = parseInt(params.sms_count) || 3500;
  paymentMethod.value = params.method || 'Orange Money';
  
  // Simuler un statut de paiement (à remplacer par appel API réel)
  const mockStatus = route.query.status || 'processing';
  status.value = mockStatus;
  
  if (status.value === 'processing') {
    simulateProgress();
  } else if (status.value === 'failed') {
    errorMessage.value = route.query.error || 'Le paiement a échoué. Veuillez réessayer.';
  }
});

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval);
  }
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>