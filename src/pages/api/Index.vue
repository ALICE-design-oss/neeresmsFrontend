
<!---
<template>
  <div class="space-y-8">
    
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Intégrez NeerePay dans votre application</h1>
      <p class="text-gray-600 mt-1">Gagnez des commissions à chaque transaction effectuée par vos utilisateurs</p>
    </div>

    
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
    
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">🔑 Vos clés API</h3>
          <p class="text-sm text-gray-500 mt-1">Utilisez ces clés pour configurer NeerePay dans votre application</p>
        </div>
        <div class="card-body space-y-6">
        
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
const integrationCode = computed(() => `
<script src="https://neeresms.io/neerepay.js"><\/script>


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
-->



<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
      <div class="max-w-3xl">
        <h1 class="text-3xl font-bold">API NeereSMS</h1>
        <p class="text-primary-100 mt-2">Une API simple, puissante et sécurisée pour envoyer des SMS et gérer les paiements</p>
        <div class="flex items-center space-x-4 mt-4">
          <span class="px-3 py-1 bg-white/20 rounded-full text-sm">📱 REST API</span>
          <span class="px-3 py-1 bg-white/20 rounded-full text-sm">🔐 Basic Auth</span>
          <span class="px-3 py-1 bg-white/20 rounded-full text-sm">⚡ Envoi en GET</span>
        </div>
      </div>
    </div>

    <!-- Section 1: Prérequis - Obtenir ses clés -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">🔑 Prérequis : Obtenir vos clés API</h3>
        <p class="text-sm text-gray-500 mt-1">Avant de commencer, vous devez signer un contrat d'intégration avec NeereLAB</p>
      </div>
      <div class="card-body">
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h4 class="font-medium text-gray-900 mb-3">1. Demande d'intégration</h4>
            <form @submit.prevent="submitRequest" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom de votre entreprise *</label>
                <input v-model="form.company" type="text" class="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email de contact *</label>
                <input v-model="form.email" type="email" class="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Téléphone *</label>
                <input v-model="form.phone" type="tel" class="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Site web / Application</label>
                <input v-model="form.website" type="text" class="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
              <div class="flex items-start">
                <input type="checkbox" v-model="form.terms" class="mt-1 h-4 w-4 text-primary-600 rounded" />
                <span class="ml-2 text-sm text-gray-600">J'accepte les <a href="#" class="text-primary-600">conditions d'utilisation</a></span>
              </div>
              <button type="submit" :disabled="loading" class="btn-primary w-full">
                <Loader v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
                Demander mes clés API
              </button>
            </form>
          </div>
          <div class="border-l border-gray-200 pl-6">
            <h4 class="font-medium text-gray-900 mb-3">2. Après signature du contrat</h4>
            <p class="text-sm text-gray-600 mb-4">Vous recevrez vos identifiants uniques :</p>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm font-mono break-all"><span class="text-gray-500">API Key:</span> <span class="text-primary-600">NRS_xxxxxxxxxxxxx</span></p>
              <p class="text-sm font-mono break-all mt-2"><span class="text-gray-500">API Token:</span> <span class="text-primary-600">sk_xxxxxxxxxxxxx</span></p>
            </div>
            <div class="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p class="text-xs text-yellow-800">⚠️ Ces identifiants vous permettent d'utiliser l'API. Gardez-les secrets !</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: Authentification (Basic Auth) -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">🔐 Authentification (Basic Auth)</h3>
        <p class="text-sm text-gray-500 mt-1">Toutes les requêtes doivent être authentifiées via Basic Auth</p>
      </div>
      <div class="card-body">
        <div class="bg-gray-900 rounded-lg p-4 mb-4">
          <pre class="text-sm text-green-400 overflow-x-auto"><code>Authorization: Basic {{ base64Example }}</code></pre>
        </div>
        <p class="text-sm text-gray-600">Le token Basic Auth est généré en encodant en Base64 : <code class="bg-gray-100 px-1">API_KEY:API_TOKEN</code></p>
        <div class="mt-3 p-3 bg-blue-50 rounded-lg">
          <p class="text-xs text-blue-800">💡 Toutes les requêtes doivent être envoyées via HTTPS avec les headers :<br/>
          - Authorization: Basic {token}<br/>
          - Accept: application/json</p>
        </div>
      </div>
    </div>

    <!-- Section 3: Envoi de SMS -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">📱 Envoi de SMS</h3>
        <p class="text-sm text-gray-500 mt-1">Endpoint : <code class="bg-gray-100 px-2 py-0.5 rounded">GET /api/v1/sms/send</code></p>
      </div>
      <div class="card-body">
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Paramètres</h4>
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50">
                <tr><th class="px-3 py-2 text-left">Paramètre</th><th class="px-3 py-2 text-left">Type</th><th class="px-3 py-2 text-left">Description</th></tr>
              </thead>
              <tbody>
                <tr class="border-b"><td class="px-3 py-2 font-mono text-xs">to</td><td class="px-3 py-2">string</td><td class="px-3 py-2">Numéro du destinataire (+226XXXXXXXX)</td></tr>
                <tr class="border-b"><td class="px-3 py-2 font-mono text-xs">text</td><td class="px-3 py-2">string</td><td class="px-3 py-2">Message à envoyer</td></tr>
                <tr class="border-b"><td class="px-3 py-2 font-mono text-xs">sender</td><td class="px-3 py-2">string</td><td class="px-3 py-2">Nom de l'expéditeur (optionnel)</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Exemple cURL</h4>
            <div class="bg-gray-900 rounded-lg p-3 relative">
              <button @click="copySmsCode" class="absolute top-2 right-2 text-gray-500 hover:text-white">
                <DocumentDuplicateIcon class="h-4 w-4" />
              </button>
              <pre class="text-xs text-green-400 overflow-x-auto"><code>{{ smsCodeExample }}</code></pre>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <h4 class="font-medium text-gray-900 mb-2">Réponse succès</h4>
          <div class="bg-gray-900 rounded-lg p-3">
            <pre class="text-xs text-green-400 overflow-x-auto"><code>{
  "success": true,
  "request_id": "SMS_1736643344_678313100f7a56",
  "data": {
    "message_id": "MSG_1736643344_6783131093bd1",
    "recipient": "+226XXXXXXXX",
    "remaining_balance": 85,
    "status": "delivered"
  }
}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 4: Vérification du solde -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">💰 Vérification du solde</h3>
        <p class="text-sm text-gray-500 mt-1">Endpoint : <code class="bg-gray-100 px-2 py-0.5 rounded">GET /api/v1/wallet/balance</code></p>
      </div>
      <div class="card-body">
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <div class="bg-gray-900 rounded-lg p-3">
              <pre class="text-xs text-green-400 overflow-x-auto"><code>{{ balanceCodeExample }}</code></pre>
            </div>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Réponse</h4>
            <div class="bg-gray-900 rounded-lg p-3">
              <pre class="text-xs text-green-400 overflow-x-auto"><code>{
  "success": true,
  "balance": 8500,
  "currency": "XOF"
}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 5: Paiement OTP -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">💳 Paiement - Système OTP</h3>
        <p class="text-sm text-gray-500 mt-1">Collectez des paiements sans redirection (Orange Money, Wave, MTN Money)</p>
      </div>
      <div class="card-body">
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Étape 1 : Initier le paiement</h4>
            <div class="bg-gray-900 rounded-lg p-3">
              <pre class="text-xs text-green-400 overflow-x-auto"><code>{{ paymentInitCode }}</code></pre>
            </div>
            <p class="text-sm text-gray-600 mt-2">Un code OTP est envoyé par SMS au client</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Étape 2 : Valider avec OTP</h4>
            <div class="bg-gray-900 rounded-lg p-3">
              <pre class="text-xs text-green-400 overflow-x-auto"><code>{{ paymentValidateCode }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 6: Codes d'erreur -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">⚠️ Codes d'erreur</h3>
        <p class="text-sm text-gray-500 mt-1">Gestion simplifiée des erreurs</p>
      </div>
      <div class="card-body">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr><th class="px-4 py-2 text-left">Code</th><th class="px-4 py-2 text-left">Message</th><th class="px-4 py-2 text-left">Description</th></tr>
          </thead>
          <tbody>
            <tr class="border-b"><td class="px-4 py-2 font-mono text-xs">1001</td><td class="px-4 py-2">Invalid credentials</td><td class="px-4 py-2">API Key ou Token invalide</td></tr>
            <tr class="border-b"><td class="px-4 py-2 font-mono text-xs">1002</td><td class="px-4 py-2">Invalid parameters</td><td class="px-4 py-2">Paramètres manquants ou invalides</td></tr>
            <tr class="border-b"><td class="px-4 py-2 font-mono text-xs">1003</td><td class="px-4 py-2">Insufficient balance</td><td class="px-4 py-2">Solde SMS insuffisant</td></tr>
            <tr class="border-b"><td class="px-4 py-2 font-mono text-xs">1004</td><td class="px-4 py-2">Invalid phone number</td><td class="px-4 py-2">Format de numéro invalide</td></tr>
            <tr class="border-b"><td class="px-4 py-2 font-mono text-xs">1005</td><td class="px-4 py-2">SMS sending failed</td><td class="px-4 py-2">Échec technique de l'envoi</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">5000</td><td class="px-4 py-2">Internal system error</td><td class="px-4 py-2">Erreur interne du système</td></tr>
          </tbody>
        </table>
        <div class="mt-4 p-3 bg-red-50 rounded-lg">
          <pre class="text-xs text-red-800 overflow-x-auto"><code>{
  "success": false,
  "error": {
    "code": 1002,
    "message": "Invalid credentials"
  }
}</code></pre>
        </div>
      </div>
    </div>

    <!-- Section 7: SDK et exemples par langage -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">📦 SDK et exemples par langage</h3>
      </div>
      <div class="card-body">
        <div class="grid md:grid-cols-3 gap-4">
          <div class="border rounded-lg p-4">
            <div class="text-2xl mb-2">🐘</div>
            <p class="font-mono text-sm font-medium">PHP</p>
            <button @click="showPhpExample = !showPhpExample" class="text-xs text-primary-600 mt-2">Voir l'exemple →</button>
            <div v-if="showPhpExample" class="mt-3">
              <div class="bg-gray-900 rounded-lg p-2">
                <pre class="text-xs text-green-400 overflow-x-auto"><code>{{ phpExample }}</code></pre>
              </div>
            </div>
          </div>
          <div class="border rounded-lg p-4">
            <div class="text-2xl mb-2">📘</div>
            <p class="font-mono text-sm font-medium">JavaScript/Node.js</p>
            <button @click="showJsExample = !showJsExample" class="text-xs text-primary-600 mt-2">Voir l'exemple →</button>
            <div v-if="showJsExample" class="mt-3">
              <div class="bg-gray-900 rounded-lg p-2">
                <pre class="text-xs text-green-400 overflow-x-auto"><code>{{ jsExample }}</code></pre>
              </div>
            </div>
          </div>
          <div class="border rounded-lg p-4">
            <div class="text-2xl mb-2">🐍</div>
            <p class="font-mono text-sm font-medium">Python</p>
            <button @click="showPythonExample = !showPythonExample" class="text-xs text-primary-600 mt-2">Voir l'exemple →</button>
            <div v-if="showPythonExample" class="mt-3">
              <div class="bg-gray-900 rounded-lg p-2">
                <pre class="text-xs text-green-400 overflow-x-auto"><code>{{ pythonExample }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 8: Tarifs -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">💰 Tarifs et commission</h3>
      </div>
      <div class="card-body">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-green-50 rounded-lg p-4">
            <h4 class="font-bold text-green-800">Pour vous (intégrateur)</h4>
            <p class="text-2xl font-bold text-green-600">90%</p>
            <p class="text-sm text-green-700">des transactions</p>
          </div>
          <div class="bg-primary-50 rounded-lg p-4">
            <h4 class="font-bold text-primary-800">Pour NeereLAB</h4>
            <p class="text-2xl font-bold text-primary-600">10%</p>
            <p class="text-sm text-primary-700">de commission</p>
          </div>
        </div>
        <div class="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
          <strong>Exemple :</strong> Votre client recharge 10.000 FCFA → Vous recevez 9.000 FCFA (90%), NeereLAB reçoit 1.000 FCFA (10%)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline';
import Loader from '../../components/common/Loader.vue';

const toast = useToast();
const loading = ref(false);
const showPhpExample = ref(false);
const showJsExample = ref(false);
const showPythonExample = ref(false);

const form = ref({
  company: '',
  email: '',
  phone: '',
  website: '',
  terms: false
});

// Exemples de code
const base64Example = computed(() => {
  return btoa('VOTRE_API_KEY:VOTRE_API_TOKEN');
});

const smsCodeExample = `curl -X GET "https://api.neeresms.io/v1/sms/send?to=+226XXXXXXXX&text=Bonjour" \\
  -H "Authorization: Basic $(echo -n 'VOTRE_API_KEY:VOTRE_API_TOKEN' | base64)" \\
  -H "Accept: application/json"`;

const balanceCodeExample = `curl -X GET "https://api.neeresms.io/v1/wallet/balance" \\
  -H "Authorization: Basic $(echo -n 'VOTRE_API_KEY:VOTRE_API_TOKEN' | base64)" \\
  -H "Accept: application/json"`;

const paymentInitCode = `// Initier le paiement (envoi OTP)
curl -X GET "https://api.neeresms.io/v1/payment/init?phone=+226XXXXXXXX&amount=1000" \\
  -H "Authorization: Basic $(echo -n 'VOTRE_API_KEY:VOTRE_API_TOKEN' | base64)"`;

const paymentValidateCode = `// Valider le paiement avec l'OTP
curl -X POST "https://api.neeresms.io/v1/payment/confirm" \\
  -H "Authorization: Basic $(echo -n 'VOTRE_API_KEY:VOTRE_API_TOKEN' | base64)" \\
  -H "Content-Type: application/json" \\
  -d '{"otp":"123456","transaction_id":"TXN_xxx"}'`;

const phpExample = `<?php
$apiKey = "VOTRE_API_KEY";
$token = "VOTRE_API_TOKEN";
$auth = base64_encode("$apiKey:$token");

$url = "https://api.neeresms.io/v1/sms/send?to=+226XXXXXXXX&text=Bonjour";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Basic $auth",
    "Accept: application/json"
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($response, true);
    print_r($data);
} else {
    echo "Erreur HTTP: $httpCode\\n";
    echo $response;
}
?>`;

const jsExample = `const axios = require('axios');

const apiKey = 'VOTRE_API_KEY';
const token = 'VOTRE_API_TOKEN';
const auth = Buffer.from(\`\${apiKey}:\${token}\`).toString('base64');

async function sendSms() {
  try {
    const response = await axios.get('https://api.neeresms.io/v1/sms/send', {
      params: { 
        to: '+226XXXXXXXX', 
        text: 'Bonjour' 
      },
      headers: { 
        Authorization: \`Basic \${auth}\`, 
        Accept: 'application/json' 
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message);
  }
}

sendSms();`;

const pythonExample = `import requests
import base64

api_key = "VOTRE_API_KEY"
token = "VOTRE_API_TOKEN"
auth = base64.b64encode(f"{api_key}:{token}".encode()).decode()

url = "https://api.neeresms.io/v1/sms/send"
params = {"to": "+226XXXXXXXX", "text": "Bonjour"}
headers = {"Authorization": f"Basic {auth}", "Accept": "application/json"}

response = requests.get(url, params=params, headers=headers)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Erreur {response.status_code}: {response.text}")`;

// Méthodes
const submitRequest = async () => {
  if (!form.value.company || !form.value.email || !form.value.phone || !form.value.terms) {
    toast.error('Veuillez remplir tous les champs obligatoires');
    return;
  }
  
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Votre demande a été envoyée ! Vous recevrez vos clés API sous 48h après signature du contrat.');
    form.value = { company: '', email: '', phone: '', website: '', terms: false };
  } catch (error) {
    toast.error('Erreur lors de l\'envoi');
  } finally {
    loading.value = false;
  }
};

const copySmsCode = () => {
  navigator.clipboard.writeText(smsCodeExample);
  toast.success('Code copié');
};
</script>