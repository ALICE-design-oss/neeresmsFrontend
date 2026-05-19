<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">NS</span>
              </div>
              <span class="ml-2 text-xl font-bold text-gray-900">NeereSMS</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/login" class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Connexion
            </router-link>
            <router-link to="/register" class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition">
              S'inscrire
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-50 to-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Envoyez des SMS <span class="text-primary-600">à grande échelle</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La plateforme SaaS qui permet aux entreprises d'envoyer des SMS en masse,
            de gérer leurs campagnes et d'intégrer nos services via une API puissante.
          </p>
          <div class="flex justify-center space-x-4">
            <router-link to="/register" class="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition">
              Commencer gratuitement
            </router-link>
            <a href="#features" class="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition">
              En savoir plus
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir NeereSMS ?</h2>
          <p class="text-xl text-gray-600">Une plateforme complète pour tous vos besoins SMS</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Envoi rapide</h3>
            <p class="text-gray-600">Envoyez des SMS en quelques secondes avec notre infrastructure optimisée.</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Sécurisé</h3>
            <p class="text-gray-600">Protection avancée avec chiffrement et authentification forte.</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">API Puissante</h3>
            <p class="text-gray-600">Intégrez facilement nos services dans vos applications.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Tarifs transparents</h2>
          <p class="text-xl text-gray-600">Des packs prépayés avec bonus pour économiser</p>
        </div>
        <div class="grid md:grid-cols-4 gap-6">
          <!-- Pack STARTER -->
          <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div class="text-4xl mb-2">🚀</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Pack STARTER</h3>
            <p class="text-3xl font-bold text-primary-600 mt-4">{{ formatPrice(5000) }}</p>
            <p class="text-gray-500 mt-1">{{ formatNumber(600) }} SMS</p>
            <p class="text-xs text-gray-400 line-through">(555 SMS)</p>
            <div class="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
              +8% de bonus
            </div>
            <p class="text-sm text-primary-600 mt-3">{{ formatPrice(5000 / 600) }}/SMS</p>
            <router-link to="/register" class="mt-6 block bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
              Choisir
            </router-link>
          </div>

          <!-- Pack BUSINESS -->
          <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow border-2 border-primary-200 relative">
            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              POPULAIRE
            </div>
            <div class="text-4xl mb-2">💼</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Pack BUSINESS</h3>
            <p class="text-3xl font-bold text-primary-600 mt-4">{{ formatPrice(25000) }}</p>
            <p class="text-gray-500 mt-1">{{ formatNumber(3200) }} SMS</p>
            <p class="text-xs text-gray-400 line-through">(2 777 SMS)</p>
            <div class="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
              +15% de bonus
            </div>
            <p class="text-sm text-primary-600 mt-3">{{ formatPrice(25000 / 3200) }}/SMS</p>
            <router-link to="/register" class="mt-6 block bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
              Choisir
            </router-link>
          </div>

          <!-- Pack ENTREPRISE -->
          <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div class="text-4xl mb-2">🏢</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Pack ENTREPRISE</h3>
            <p class="text-3xl font-bold text-primary-600 mt-4">{{ formatPrice(100000) }}</p>
            <p class="text-gray-500 mt-1">{{ formatNumber(14000) }} SMS</p>
            <p class="text-xs text-gray-400 line-through">(11 111 SMS)</p>
            <div class="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
              +26% de bonus
            </div>
            <p class="text-sm text-primary-600 mt-3">{{ formatPrice(100000 / 14000) }}/SMS</p>
            <router-link to="/register" class="mt-6 block bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
              Choisir
            </router-link>
          </div>

          <!-- Pack REVENDEUR - avec lien spécifique -->
          <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-white">
            <div class="text-4xl mb-2">🤝</div>
            <h3 class="text-xl font-bold text-purple-700 mb-2">Pack REVENDEUR</h3>
            <p class="text-3xl font-bold text-purple-600 mt-4">{{ formatPrice(500000) }}</p>
            <p class="text-gray-500 mt-1">{{ formatNumber(75000) }} SMS</p>
            <p class="text-xs text-gray-400 line-through">(55 555 SMS)</p>
            <div class="mt-2 inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
              +35% de bonus
            </div>
            <p class="text-sm text-purple-600 mt-3">{{ formatPrice(500000 / 75000) }}/SMS</p>
            <!-- Lien spécifique pour devenir revendeur -->
            <button 
              @click="handleResellerClick" 
              class="mt-6 block w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Devenir revendeur
            </button>
          </div>
        </div>
        
        <!-- Note sur les bonus -->
        <div class="text-center mt-8">
          <p class="text-sm text-gray-500">
            💡 Plus vous rechargez, plus vous économisez ! Les bonus sont automatiquement appliqués.
          </p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-primary-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <p class="text-4xl font-bold">99.9%</p>
            <p class="mt-2">Taux de livraison</p>
          </div>
          <div>
            <p class="text-4xl font-bold">10M+</p>
            <p class="mt-2">SMS envoyés</p>
          </div>
          <div>
            <p class="text-4xl font-bold">500+</p>
            <p class="mt-2">Entreprises clientes</p>
          </div>
          <div>
            <p class="text-4xl font-bold">24/7</p>
            <p class="mt-2">Support client</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto text-center px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Prêt à envoyer des SMS à grande échelle ?</h2>
        <p class="text-xl text-gray-600 mb-8">Rejoignez des milliers d'entreprises qui nous font confiance</p>
        <router-link to="/register" class="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition">
          Créer un compte gratuitement
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center">
              <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold">NS</span>
              </div>
              <span class="ml-2 text-xl font-bold">NeereSMS</span>
            </div>
            <p class="mt-4 text-gray-400 text-sm">Plateforme SMS professionnelle pour entreprises</p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Produit</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>Fonctionnalités</li>
              <li>Tarifs</li>
              <li>API</li>
              <li>Sécurité</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Support</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>Documentation</li>
              <li>Contact</li>
              <li>Statut</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Légal</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>Conditions d'utilisation</li>
              <li>Politique de confidentialité</li>
              <li>Mentions légales</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          &copy; 2026 NeereSMS.io - Tous droits réservés
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

// Gestion du clic sur "Devenir revendeur"
const handleResellerClick = () => {
  // Vérifier si l'utilisateur est connecté
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    // Si déjà connecté, rediriger directement vers apply
    router.push('/reseller/apply');
  } else {
    // Sinon, rediriger vers la page d'inscription avec un paramètre
    router.push('/register?redirect=reseller');
  }
};
</script>