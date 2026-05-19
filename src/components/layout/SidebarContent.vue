<template>
  <div class="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
    <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div class="flex items-center flex-shrink-0 px-4">
        <div class="h-8 w-8 bg-primary-600 rounded flex items-center justify-center">
          <span class="text-white font-bold text-sm">NS</span>
        </div>
        <span class="ml-2 text-xl font-bold text-gray-900">NeereSMS</span>
      </div>
      <nav class="mt-5 flex-1 px-2 space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
          :class="[
            $route.path === item.to
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
        >
          <component
            :is="item.icon"
            class="mr-3 flex-shrink-0 h-6 w-6"
            :class="[
              $route.path === item.to
                ? 'text-gray-500'
                : 'text-gray-400 group-hover:text-gray-500'
            ]"
          />
          {{ item.name }}
        </router-link>
      </nav>
    </div>
    <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
      <div class="flex-shrink-0 w-full group block">
        <div class="flex items-center">
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-700">{{ user?.name || 'Utilisateur' }}</p>
            <p class="text-xs font-medium text-gray-500">{{ user?.email || 'Non connecté' }}</p>
          </div>
        </div>
        <button
          @click="logout"
          class="mt-2 w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
        >
          <ArrowRightOnRectangleIcon class="mr-3 h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import { useUserStore } from '../../store/user';
import {
  HomeIcon,
  EnvelopeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  WalletIcon,
  CodeBracketIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const user = computed(() => userStore.user);

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Envoyer SMS', to: '/sms/send', icon: EnvelopeIcon },
  { name: 'SMS en masse', to: '/sms/bulk', icon: EnvelopeIcon },
  { name: 'Campagnes', to: '/campaigns', icon: ChartBarIcon },
  { name: 'Rapports', to: '/reports', icon: DocumentTextIcon },
  { name: 'Wallet', to: '/wallet', icon: WalletIcon },
  { name: 'API', to: '/api', icon: CodeBracketIcon },
  { name: 'Revendeur', to: '/reseller/apply', icon: UserGroupIcon },
  { name: 'Paramètres', to: '/dashboard/settings', icon: Cog6ToothIcon },
  { name: 'Profil', to: '/dashboard/profile', icon: Cog6ToothIcon },
 
];

const logout = async () => {
  await authStore.logout();
  router.push('/');
};
</script>