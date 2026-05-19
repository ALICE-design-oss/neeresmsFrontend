import api from './api';

export const reportsService = {
  // Récupérer les statistiques globales
  async getGlobalStats(params = {}) {
    const response = await api.get('/reports/stats', { params });
    return response.data;
  },
  
  // Récupérer l'historique des SMS
  async getSmsHistory(params = {}) {
    const response = await api.get('/reports/sms', { params });
    return response.data;
  },
  
  // Exporter les données
  async exportData(type, params = {}) {
    const response = await api.get(`/reports/export/${type}`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  
  // Récupérer les statistiques par pays
  async getCountryStats() {
    const response = await api.get('/reports/countries');
    return response.data;
  },
  
  // Récupérer les statistiques par fournisseur
  async getProviderStats() {
    const response = await api.get('/reports/providers');
    return response.data;
  }
};