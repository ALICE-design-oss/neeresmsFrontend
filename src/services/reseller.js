import api from './api';

export const resellerService = {
  // Récupérer les statistiques du revendeur
  async getStats() {
    const response = await api.get('/reseller/stats');
    return response.data;
  },
  
  // Récupérer les commissions
  async getCommissions(params = {}) {
    const response = await api.get('/reseller/commissions', { params });
    return response.data;
  },
  
  // Récupérer les clients (revendeurs)
  async getClients(params = {}) {
    const response = await api.get('/reseller/clients', { params });
    return response.data;
  },
  
  // Générer un lien de parrainage
  async generateReferralLink() {
    const response = await api.post('/reseller/referral-link');
    return response.data;
  },
  
  // Récupérer les niveaux de revendeur
  async getLevels() {
    const response = await api.get('/reseller/levels');
    return response.data;
  },
  
  // Demander un paiement de commission
  async requestPayout(amount) {
    const response = await api.post('/reseller/payout', { amount });
    return response.data;
  }
};