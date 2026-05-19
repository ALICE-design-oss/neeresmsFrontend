/*import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    loading: false,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user,
  },
  
  actions: {
    async login(email, password) {
      this.loading = true;
      
      // Simulation de connexion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.user = {
        id: 1,
        name: email.split('@')[0] || 'Utilisateur',
        email: email,
        phone: '',
        company: '',
        wallet_balance: 45500,
        tier: 'free',
        created_at: new Date().toISOString()
      };
      this.token = 'test_token_' + Date.now();
      
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      
      this.loading = false;
      return { user: this.user };
    },
    
    async register(userData) {
      this.loading = true;
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.user = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        company: userData.company || '',
        wallet_balance: 1000, // Bonus d'inscription
        tier: 'free',
        created_at: new Date().toISOString()
      };
      this.token = 'test_token_' + Date.now();
      
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      
      this.loading = false;
      return { user: this.user };
    },
    
    async logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    initFromStorage() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
      }
    }
  },
})
*/

import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    loading: false,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user,
  },
  
  actions: {
    async login(email, password) {
      this.loading = true;
      
      // Simulation de connexion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.user = {
        id: Date.now(),
        name: email.split('@')[0] || 'Utilisateur',
        email: email,
        provider: 'email',
        wallet_balance: 45500,
        created_at: new Date().toISOString()
      };
      this.token = 'token_' + Date.now();
      
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      
      this.loading = false;
      return { user: this.user };
    },
    
    async register(userData) {
      this.loading = true;
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.user = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        company: userData.company || '',
        provider: 'email',
        wallet_balance: 1000,
        created_at: new Date().toISOString()
      };
      this.token = 'token_' + Date.now();
      
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      
      this.loading = false;
      return { user: this.user };
    },
    
    async logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    initFromStorage() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
      }
    }
  },
});