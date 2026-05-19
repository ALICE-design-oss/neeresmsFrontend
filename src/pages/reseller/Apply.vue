<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Devenir revendeur</h1>
        <p class="mt-1 text-sm text-gray-500">
          Rejoignez notre programme revendeur et gagnez des commissions
        </p>
      </div>
      <router-link to="/dashboard" class="btn-secondary">
        ← Retour
      </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Formulaire de candidature -->
      <div class="lg:col-span-2">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Formulaire de candidature</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
              <div>
                <label for="company" class="block text-sm font-medium text-gray-700">
                  Nom de l'entreprise *
                </label>
                <div class="mt-1">
                  <input
                    id="company"
                    v-model="form.company"
                    type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Votre entreprise"
                  />
                </div>
              </div>

              <div>
                <label for="website" class="block text-sm font-medium text-gray-700">
                  Site web
                </label>
                <div class="mt-1">
                  <input
                    id="website"
                    v-model="form.website"
                    type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="https://votreentreprise.com"
                  />
                </div>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">
                  Téléphone *
                </label>
                <div class="mt-1">
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="+226 07 00 00 00"
                  />
                </div>
              </div>

              <div>
                <label for="volume" class="block text-sm font-medium text-gray-700">
                  Volume SMS mensuel estimé *
                </label>
                <div class="mt-1">
                  <select
                    id="volume"
                    v-model="form.volume"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Sélectionnez un volume</option>
                    <option value="1000">Moins de 1 000 SMS/mois</option>
                    <option value="10000">1 000 - 10 000 SMS/mois</option>
                    <option value="50000">10 000 - 50 000 SMS/mois</option>
                    <option value="100000">50 000 - 100 000 SMS/mois</option>
                    <option value="500000">Plus de 100 000 SMS/mois</option>
                  </select>
                </div>
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-gray-700">
                  Pourquoi voulez-vous devenir revendeur ?
                </label>
                <div class="mt-1">
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="4"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Décrivez votre projet..."
                  ></textarea>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-2">Conditions générales</h4>
                <div class="space-y-2 text-sm text-gray-600">
                  <label class="flex items-start">
                    <input
                      type="checkbox"
                      v-model="form.terms"
                      class="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="ml-2">
                      Je certifie que les informations fournies sont exactes et je m'engage à respecter 
                      les <a href="#" class="text-primary-600">conditions du programme revendeur</a>
                    </span>
                  </label>
                  <label class="flex items-start mt-2">
                    <input
                      type="checkbox"
                      v-model="form.commission"
                      class="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="ml-2">
                      J'accepte le barème des commissions et les modalités de paiement
                    </span>
                  </label>
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <router-link to="/reseller" class="btn-secondary">
                  Annuler
                </router-link>
                <button
                  type="submit"
                  :disabled="loading || !canSubmit"
                  class="btn-primary"
                >
                  <Loader v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
                  {{ loading ? 'Envoi en cours...' : 'Envoyer ma candidature' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Informations sur le programme -->
      <div class="lg:col-span-1">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Avantages revendeur</h3>
          </div>
          <div class="card-body space-y-4">
            <div class="flex items-start space-x-3">
              <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <span class="text-green-600 text-sm">💰</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Jusqu'à 25% de commission</p>
                <p class="text-xs text-gray-500">Sur toutes les recharges de vos clients</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span class="text-blue-600 text-sm">📊</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Dashboard dédié</p>
                <p class="text-xs text-gray-500">Suivez vos performances en temps réel</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Niveaux de commission -->
        <div class="card mt-6">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Niveaux de commission</h3>
          </div>
          <div class="card-body">
            <div class="space-y-3">
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span class="font-medium">🥉 Bronze</span>
                  <p class="text-xs text-gray-500">100.000 FCFA/mois</p>
                </div>
                <span class="text-primary-600 font-bold">15%</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span class="font-medium">🥈 Silver</span>
                  <p class="text-xs text-gray-500">500.000 FCFA/mois</p>
                </div>
                <span class="text-primary-600 font-bold">20%</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span class="font-medium">🥇 Gold</span>
                  <p class="text-xs text-gray-500">2.000.000 FCFA/mois</p>
                </div>
                <span class="text-primary-600 font-bold">25%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ rapide -->
        <div class="card mt-6">
          <div class="card-header">
            <h3 class="text-lg font-medium text-gray-900">Questions fréquentes</h3>
          </div>
          <div class="card-body space-y-3">
            <details class="group">
              <summary class="text-sm font-medium text-gray-700 cursor-pointer hover:text-primary-600">
                Comment sont calculées les commissions ?
              </summary>
              <p class="mt-2 text-xs text-gray-500">
                Les commissions sont calculées sur le montant des recharges effectuées par vos clients.
              </p>
            </details>
            <details class="group">
              <summary class="text-sm font-medium text-gray-700 cursor-pointer hover:text-primary-600">
                Quand sont versées les commissions ?
              </summary>
              <p class="mt-2 text-xs text-gray-500">
                Les commissions sont versées mensuellement, après validation des transactions.
              </p>
            </details>
            <details class="group">
              <summary class="text-sm font-medium text-gray-700 cursor-pointer hover:text-primary-600">
                Y a-t-il des frais d'entrée ?
              </summary>
              <p class="mt-2 text-xs text-gray-500">
                Non, l'inscription au programme revendeur est totalement gratuite.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import Loader from '../../components/common/Loader.vue';

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const form = reactive({
  company: '',
  website: '',
  phone: '',
  volume: '',
  message: '',
  terms: false,
  commission: false
});

const canSubmit = computed(() => {
  return form.company && form.phone && form.volume && form.terms && form.commission;
});

const handleSubmit = async () => {
  if (!canSubmit.value) {
    toast.error('Veuillez remplir tous les champs obligatoires');
    return;
  }
  
  loading.value = true;
  
  try {
    // Simuler l'envoi de la candidature
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Votre candidature a été envoyée avec succès ! Nous vous contacterons sous 48h.');
    router.push('/reseller');
  } catch (error) {
    toast.error('Erreur lors de l\'envoi de la candidature');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
details summary {
  list-style: none;
}
details summary::-webkit-details-marker {
  display: none;
}
details summary::before {
  content: '▶';
  display: inline-block;
  margin-right: 8px;
  font-size: 10px;
  transition: transform 0.2s;
}
details[open] summary::before {
  transform: rotate(90deg);
}
</style>