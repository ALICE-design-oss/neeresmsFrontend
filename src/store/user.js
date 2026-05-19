import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
  },
  
  actions: {
    setUser(userData) {
      this.user = userData;
    },
    
    clearUser() {
      this.user = null;
    },
    
    updateUser(userData) {
      this.user = { ...this.user, ...userData };
    },
  },
});