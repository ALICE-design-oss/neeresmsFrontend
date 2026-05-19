import api from './api';

export const walletService = {
  // Récupérer le solde
  async getBalance() {
    const response = await api.get('/wallet/balance');
    return response.data;
  },
  
  // Récupérer l'historique des transactions
  async getTransactions(params = {}) {
    const response = await api.get('/wallet/transactions', { params });
    return response.data;
  },
  
  // Initier un dépôt
  async initiateDeposit(data) {
    const response = await api.post('/wallet/deposit', data);
    return response.data;
  },
  
  // Confirmer un dépôt (webhook)
  async confirmDeposit(reference) {
    const response = await api.post(`/wallet/deposit/${reference}/confirm`);
    return response.data;
  },
  
  // Récupérer les méthodes de paiement disponibles
  async getPaymentMethods() {
    const response = await api.get('/wallet/payment-methods');
    return response.data;
  },
  
  // Récupérer les packs de crédits
  async getCreditPacks() {
    const response = await api.get('/wallet/credit-packs');
    return response.data;
  },
  
  // Appliquer un code promo
  async applyPromoCode(code) {
    const response = await api.post('/wallet/apply-promo', { code });
    return response.data;
  }
};