<template>
  <div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
    <button
      type="button"
      class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
      @click="$emit('toggle-sidebar')"
    >
      <span class="sr-only">Ouvrir la sidebar</span>
      <Bars3Icon class="h-6 w-6" aria-hidden="true" />
    </button>
    <div class="flex-1 px-4 flex justify-between">
      <div class="flex-1 flex items-center">
        <div class="max-w-xs w-full">
          <label for="search" class="sr-only">Rechercher</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              name="search"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Rechercher"
              type="search"
            />
          </div>
        </div>
      </div>
      <div class="ml-4 flex items-center md:ml-6">
        <!-- Notifications -->
        <button
          type="button"
          class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <span class="sr-only">Voir les notifications</span>
          <BellIcon class="h-6 w-6" />
        </button>

        <!-- Profile -->
        <div class="ml-3 relative">
          <div>
            <button
              type="button"
              class="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              @click="dropdownOpen = !dropdownOpen"
            >
              <span class="sr-only">Ouvrir le menu utilisateur</span>
              <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                {{ userInitials }}
              </div>
            </button>
          </div>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="dropdownOpen"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <router-link
                to="/dashboard/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="dropdownOpen = false"
              >
                Votre profil
              </router-link>
              <router-link
                to="/dashboard/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="dropdownOpen = false"
              >
                Paramètres
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Déconnexion
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import { useUserStore } from '../../store/user';
import { Bars3Icon, MagnifyingGlassIcon, BellIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const dropdownOpen = ref(false);

const userInitials = computed(() => {
  const user = userStore.user;
  if (user && user.name) {
    return user.name.charAt(0).toUpperCase();
  }
  return 'U';
});

const handleLogout = async () => {
  dropdownOpen.value = false;
  await authStore.logout();
  router.push('/');
};
</script>