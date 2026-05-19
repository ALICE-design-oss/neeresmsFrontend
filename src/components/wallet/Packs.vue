<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Packs de crédits SMS</h1>
        <p class="mt-1 text-sm text-gray-500">
          Choisissez le pack qui correspond à vos besoins
        </p>
      </div>
      <router-link to="/wallet" class="btn-secondary">
        ← Retour au wallet
      </router-link>
    </div>

    <!-- Packs -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        v-for="pack in packs" 
        :key="pack.name" 
        class="card hover:shadow-xl transition-all duration-300 cursor-pointer"
        :class="{ 'ring-2 ring-primary-500 shadow-lg': selectedPack?.name === pack.name }"
        @click="selectPack(pack)"
      >
        <div class="card-body text-center">
          <div class="text-5xl mb-4">{{ pack.icon }}</div>
          <h3 class="text-xl font-bold text-gray-900">{{ pack.name }}</h3>
          <p class="text-3xl font-bold text-primary-600 mt-4">{{ formatPrice(pack.price) }}</p>
          <p class="text-gray-500">{{ pack.sms_count }} SMS</p>
          <p class="text-sm text-green-600 mt-2">{{ formatPrice(pack.price / pack.sms_count) }}/SMS</p>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <ul class="text-sm text-gray-600 space-y-2 text-left">
              <li v-for="feature in pack.features" :key="feature" class="flex items-center">
                <CheckCircleIcon class="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                {{ feature }}
              </li>
            </ul>
          </div>
          
          <button 
            @click.stop="proceedToPayment(pack)" 
            class="mt-6 w-full btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': selectedPack?.name !== pack.name }"
          >
            Choisir ce pack
          </button>
        </div>
      </div>
    </div>

    <!-- Recommandation personnalisée -->
    <div class="card bg-gradient-to-r from-primary-50 to-primary-100">
      <div class="card-body">
        <div class="flex items-start space-x-4">
          <div class="h-12 w-12 rounded-full bg-primary-200 flex items-center justify-center flex-shrink-0">
            <SparklesIcon class="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Recommandation personnalisée</h3>
            <p class="text-gray-600 mt-1">
              D'après votre historique d'envoi ({{ formatNumber(monthlySms) }} SMS/mois), 
              le pack <strong>{{ recommendedPack.name }}</strong> est le plus adapté pour vous.
            </p>
            <p class="text-sm text-primary-600 mt-2">
              Économisez jusqu'à {{ formatPrice(recommendedPack.savings) }} par mois !
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de paiement -->
    <Modal :is-open="showPaymentModal" title="Paiement" @close="showPaymentModal = false">
      <div class="space-y-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Pack</span>
            <span class="font-medium">{{ selectedPack?.name }}</span>
          </div>
          <div class="flex justify-between text-sm mt-2">
            <span class="text-gray-500">SMS</span>
            <span class="font-medium">{{ selectedPack?.sms_count }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-gray-200">
            <span>Total à payer</span>
            <span class="text-primary-600">{{ formatPrice(selectedPack?.price) }}</span>
          </div>
        </div>
        
        <PaymentMethodSelector v-model="selectedMethod" />
        
        <div v-if="selectedMethod?.id === 'orange_money' || selectedMethod?.id === 'mtn_money'" class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
          <input v-model="phoneNumber" type="tel" class="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="+225 07 00 00 00" />
        </div>
        
        <div class="bg-yellow-50 rounded-lg p-3">
          <p class="text-xs text-yellow-800">
            ⚠️ Après paiement, les crédits seront ajoutés instantanément à votre compte.
          </p>
        </div>
      </div>
      
      <template #actions>
        <button @click="showPaymentModal = false" class="btn-secondary">Annuler</button>
        <button @click="processPayment" class="btn-primary">Payer {{ formatPrice(selectedPack?.price) }}</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import Modal from '../../components/common/Modal.vue';
import PaymentMethodSelector from '../../components/wallet/PaymentMethodSelector.vue';

const router = useRouter();
const toast = useToast();

// États
const packs = ref([
  {
    name: 'Starter',
    icon: '🚀',
    price: 5000,
    sms_count: 600,
    features: [
      'Jusqu\'à 600 SMS',
      'Support email',
      'API standard',
      'Statistiques de base',
      'Campagnes simples'
    ]
  },
  {
    name: 'Business',
    icon: '💼',
    price: 25000,
    sms_count: 3500,
    features: [
      'Jusqu\'à 3500 SMS',
      'Support prioritaire',
      'API avancée',
      'Statistiques détaillées',
      'Campagnes programmées',
      'Multi-utilisateurs'
    ]
  },
  {
    name: 'Enterprise',
    icon: '🏢',
    price: 100000,
    sms_count: 16000,
    features: [
      'Jusqu\'à 16000 SMS',
      'Support dédié 24/7',
      'API personnalisée',
      'Analytics avancés',
      'Account manager dédié',
      'SLA garanti 99.9%'
    ]
  }
]);

const selectedPack = ref(null);
const selectedMethod = ref(null);
const phoneNumber = ref('');
const showPaymentModal = ref(false);
const monthlySms = ref(1245);

const recommendedPack = computed(() => {
  if (monthlySms.value < 1000) return { name: 'Starter', savings: 0 };
  if (monthlySms.value < 3000) return { name: 'Business', savings: 5000 };
  return { name: 'Enterprise', savings: 15000 };
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

const selectPack = (pack) => {
  selectedPack.value = pack;
};

const proceedToPayment = (pack) => {
  selectedPack.value = pack;
  showPaymentModal.value = true;
};

const processPayment = async () => {
  if (!selectedMethod.value) {
    toast.error('Veuillez choisir une méthode de paiement');
    return;
  }
  
  toast.info('Traitement du paiement en cours...');
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  toast.success(`Paiement de ${formatPrice(selectedPack.value.price)} effectué avec succès !`);
  showPaymentModal.value = false;
  
  // Redirection vers le wallet
  router.push('/wallet');
};

onMounted(() => {
  // Charger les données
});
</script>