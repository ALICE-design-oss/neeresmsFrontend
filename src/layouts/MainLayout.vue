<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <div class="lg:pl-64 flex flex-col flex-1">
      <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      
      <main class="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import Navbar from '../components/layout/Navbar.vue';

const sidebarOpen = ref(false);
</script>