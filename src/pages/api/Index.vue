
<!--
<template>
  <div class="space-y-6">
    
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">API Développeur</h1>
        <p class="mt-1 text-sm text-gray-500">
          Gérez vos clés API et consultez la documentation
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
     
      <div class="lg:col-span-2">
        <div class="card">
          <div class="card-header flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Mes clés API</h3>
            <button @click="generateApiKey" class="btn-primary text-sm">
              <PlusIcon class="h-4 w-4 mr-1" />
              Générer une clé
            </button>
          </div>
          <div class="card-body">
            <div v-if="apiKeys.length === 0" class="text-center py-8">
              <KeyIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune clé API</h3>
              <p class="mt-1 text-sm text-gray-500">
                Commencez par générer votre première clé API.
              </p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="key in apiKeys"
                :key="key.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ key.name }}</p>
                    
                   
                    <div class="flex items-center space-x-2 mt-1">
                      <code class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        <span v-if="!keyVisible[key.id]">{{ maskApiKey(key.key) }}</span>
                        <span v-else>{{ key.key }}</span>
                      </code>
                      <button 
                        @click="toggleKeyVisibility(key.id)" 
                        class="text-gray-400 hover:text-gray-600"
                        :title="keyVisible[key.id] ? 'Masquer' : 'Afficher'"
                      >
                        <EyeIcon v-if="!keyVisible[key.id]" class="h-4 w-4" />
                        <EyeSlashIcon v-else class="h-4 w-4" />
                      </button>
                      <button 
                        @click="copyKey(key.key)" 
                        class="text-gray-400 hover:text-gray-600"
                        title="Copier"
                      >
                        <DocumentDuplicateIcon class="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div class="flex space-x-4 mt-2">
                      <span class="text-xs text-gray-500">
                        Créée le {{ formatDate(key.created_at) }}
                      </span>
                      <span class="text-xs" :class="key.last_used ? 'text-green-600' : 'text-gray-400'">
                        Dernière utilisation: {{ key.last_used || 'Jamais' }}
                      </span>
                    </div>
                  </div>
                  <button @click="revokeKey(key.id)" class="text-red-400 hover:text-red-600">
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
                
                <div class="mt-3 pt-3 border-t border-gray-100">
                  <div class="flex flex-wrap gap-2">
                    <span class="text-xs text-gray-500">Permissions:</span>
                    <span
                      v-for="perm in key.permissions"
                      :key="perm"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ perm }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div class="lg:col-span-1">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Usage API</h3>
          </div>
          <div class="card-body space-y-4">
            <div>
              <p class="text-sm text-gray-500">Requêtes ce mois</p>
              <p class="text-2xl font-bold text-gray-900">{{ apiUsage.total }}</p>
              <div class="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-primary-600 h-2 rounded-full"
                  :style="{ width: `${(apiUsage.total / apiUsage.limit) * 100}%` }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Limite: {{ formatNumber(apiUsage.limit) }} requêtes
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p class="text-xs text-gray-500">Succès</p>
                <p class="text-lg font-semibold text-green-600">{{ formatNumber(apiUsage.success) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Erreurs</p>
                <p class="text-lg font-semibold text-red-600">{{ formatNumber(apiUsage.errors) }}</p>
              </div>
            </div>
          </div>
        </div>

        
        <div class="card mt-6">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Monitoring API</h3>
          </div>
          <div class="card-body">
            <router-link 
              to="/api/logs" 
              class="flex items-center justify-between text-primary-600 hover:text-primary-700"
            >
              <span>Voir les journaux des requêtes</span>
              <ArrowRightIcon class="h-4 w-4" />
            </router-link>
          </div>
        </div>
      </div>
    </div>

   
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Documentation API</h3>
      </div>
      <div class="card-body">
       
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { 
  PlusIcon, 
  KeyIcon, 
  DocumentDuplicateIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline';

const toast = useToast();

// États
const apiKeys = ref([
  {
    id: 1,
    name: 'Clé de production',
    key: 'nrs_live_abc123def456ghi789',
    created_at: new Date().toISOString(),
    last_used: 'Il y a 2 heures',
    permissions: ['send_sms', 'read_reports', 'manage_campaigns']
  },
  {
    id: 2,
    name: 'Clé de test',
    key: 'nrs_test_xyz789uvw456rst123',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    last_used: null,
    permissions: ['send_sms']
  }
]);

const keyVisible = ref({});
const apiUsage = ref({ total: 12450, limit: 50000, success: 12100, errors: 350 });

// Fonctions
const maskApiKey = (key) => {
  if (!key) return '';
  return key.substring(0, 8) + '••••••••' + key.substring(key.length - 4);
};

const toggleKeyVisibility = (id) => {
  keyVisible.value[id] = !keyVisible.value[id];
};

const copyKey = (key) => {
  navigator.clipboard.writeText(key);
  toast.success('Clé API copiée dans le presse-papier');
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR');
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

const generateApiKey = () => {
  toast.info('Génération de clé API - Fonctionnalité à venir');
};

const revokeKey = (id) => {
  if (confirm('Êtes-vous sûr de vouloir révoquer cette clé API ?')) {
    apiKeys.value = apiKeys.value.filter(k => k.id !== id);
    toast.success('Clé API révoquée');
  }
};

onMounted(() => {
  // Initialisation
});
</script-->


<template>
  <div class="space-y-8">
    <!-- En-tête -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Intégrez NeerePay dans votre application</h1>
      <p class="text-gray-600 mt-1">Gagnez des commissions à chaque transaction effectuée par vos utilisateurs</p>
    </div>

    <!-- Modèle économique -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
      <div class="flex items-start gap-4">
        <div class="bg-blue-100 p-3 rounded-xl">
          <CurrencyDollarIcon class="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900">💡 Comment ça marche ?</h3>
          <p class="text-gray-700 mt-1">
            Vos utilisateurs achètent des crédits SMS via votre application. 
            <strong>NeereLAB</strong> prélève <strong>10% de commission</strong> sur chaque transaction.
            Le reste (90%) est crédité sur votre wallet NeereSMS.
          </p>
          <div class="mt-3 bg-white rounded-lg p-3 inline-block">
            <p class="text-sm font-mono">Exemple: Client paie 10.000 FCFA → Vous recevez 9.000 FCFA (90%) → NeereLAB reçoit 1.000 FCFA (10%)</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Configuration des clés API -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">🔑 Vos clés API</h3>
          <p class="text-sm text-gray-500 mt-1">Utilisez ces clés pour configurer NeerePay dans votre application</p>
        </div>
        <div class="card-body space-y-6">
          <!-- Clé publique -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Clé publique (Publishable Key)</label>
            <div class="mt-1 flex items-center gap-2">
              <code class="flex-1 bg-gray-100 p-2 rounded text-sm font-mono">
                <span v-if="!showPublicKey">pk_live_••••••••••••••••</span>
                <span v-else>{{ publicKey }}</span>
              </code>
              <button @click="togglePublicKey" class="p-2 text-gray-500 hover:text-gray-700">
                <EyeIcon v-if="!showPublicKey" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
              <button @click="copyKey(publicKey)" class="p-2 text-gray-500 hover:text-gray-700">
                <DocumentDuplicateIcon class="h-5 w-5" />
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Cette clé peut être utilisée côté client (JavaScript)</p>
          </div>

          <!-- Clé secrète -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Clé secrète (Secret Key)</label>
            <div class="mt-1 flex items-center gap-2">
              <code class="flex-1 bg-gray-100 p-2 rounded text-sm font-mono">
                <span v-if="!showSecretKey">sk_live_••••••••••••••••</span>
                <span v-else>{{ secretKey }}</span>
              </code>
              <button @click="toggleSecretKey" class="p-2 text-gray-500 hover:text-gray-700">
                <EyeIcon v-if="!showSecretKey" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
              <button @click="copyKey(secretKey)" class="p-2 text-gray-500 hover:text-gray-700">
                <DocumentDuplicateIcon class="h-5 w-5" />
              </button>
            </div>
            <p class="text-xs text-red-600 mt-1">⚠️ Ne partagez jamais cette clé. Utilisez-la uniquement côté serveur.</p>
          </div>

          <button @click="regenerateKeys" class="text-sm text-red-600 hover:text-red-700">
            Regénérer les clés API
          </button>
        </div>
      </div>

      <!-- Widget de test -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">🧪 Tester le widget</h3>
          <p class="text-sm text-gray-500 mt-1">Simulez un paiement pour voir le widget en action</p>
        </div>
        <div class="card-body space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Montant (FCFA)</label>
            <input type="number" v-model="testAmount" class="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email client</label>
            <input type="email" v-model="testEmail" class="mt-1 w-full px-3 py-2 border rounded-md" placeholder="client@example.com" />
          </div>
          <button @click="testWidget" class="w-full btn-primary">
            Tester le widget de paiement
          </button>
        </div>
      </div>
    </div>

    <!-- Code d'intégration -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">📋 Code d'intégration</h3>
        <p class="text-sm text-gray-500 mt-1">Copiez-collez ce code dans votre application</p>
      </div>
      <div class="card-body">
        <div class="bg-gray-900 rounded-lg p-4 relative">
          <pre class="text-sm text-gray-300 overflow-x-auto"><code>{{ integrationCode }}</code></pre>
          <button @click="copyIntegrationCode" class="absolute top-2 right-2 p-1 rounded bg-gray-800 text-gray-400 hover:text-white">
            <DocumentDuplicateIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Statistiques des commissions -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">📊 Statistiques des commissions</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600">Total des commissions perçues</p>
            <p class="text-2xl font-bold text-green-600">{{ formatPrice(totalCommissions) }}</p>
            <p class="text-xs text-gray-500">Dont 10% pour NeereLAB</p>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600">Transactions via votre application</p>
            <p class="text-2xl font-bold text-blue-600">{{ totalTransactions }}</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-sm text-gray-600">Taux de commission</p>
            <p class="text-2xl font-bold text-purple-600">10%</p>
            <p class="text-xs text-gray-500">Automatiquement prélevé</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { EyeIcon, EyeSlashIcon, DocumentDuplicateIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline';

const toast = useToast();

// Données
const publicKey = ref('pk_live_abc123def456ghi789');
const secretKey = ref('sk_live_xyz789uvw456rst123');
const showPublicKey = ref(false);
const showSecretKey = ref(false);
const testAmount = ref(5000);
const testEmail = ref('client@example.com');

const totalCommissions = ref(125000);
const totalTransactions = ref(342);

// Code d'intégration
const integrationCode = computed(() => `<!-- Ajoutez ce script dans votre page -->
<script src="https://neeresms.io/neerepay.js"><\/script>

<!-- Ajoutez le bouton de paiement -->
<button id="neerepay-btn" style="padding: 12px 24px; background: #3B82F6; color: white; border: none; border-radius: 8px; cursor: pointer;">
  Acheter des crédits SMS
</button>

<script>
  document.getElementById('neerepay-btn').addEventListener('click', function() {
    NeerePay.checkout({
      public_key: '${publicKey.value}',
      amount: 5000,
      currency: 'XOF',
      customer: {
        email: 'client@votreapp.com'
      },
      callback: function(response) {
        console.log('Paiement réussi:', response);
        window.location.href = '/payment/success?ref=' + response.transaction_id;
      }
    });
  });
<\/script>`);

// Méthodes
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price);
};

const copyKey = (key) => {
  navigator.clipboard.writeText(key);
  toast.success('Clé copiée dans le presse-papier');
};

const copyIntegrationCode = () => {
  navigator.clipboard.writeText(integrationCode.value);
  toast.success('Code d\'intégration copié');
};

const togglePublicKey = () => { showPublicKey.value = !showPublicKey.value; };
const toggleSecretKey = () => { showSecretKey.value = !showSecretKey.value; };

const regenerateKeys = () => {
  if (confirm('⚠️ La régénération des clés API désactivera l\'intégration existante. Continuer ?')) {
    toast.success('Nouvelles clés API générées');
  }
};

const testWidget = () => {
  // Simuler l'ouverture du widget avec les paramètres de test
  toast.info(`Test du widget avec ${formatPrice(testAmount.value)} pour ${testEmail.value}`);
  // Dans un vrai environnement, cela ouvrirait le widget NeerePay
  // window.NeerePay.checkout({...})
};
</script>