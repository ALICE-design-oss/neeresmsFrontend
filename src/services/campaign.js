import api from './api';

export const campaignService = {
  // Récupérer toutes les campagnes
  async getCampaigns(params = {}) {
    const response = await api.get('/campaigns', { params });
    return response.data;
  },
  
  // Récupérer une campagne spécifique
  async getCampaign(id) {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },
  
  // Créer une campagne
  async createCampaign(data) {
    const response = await api.post('/campaigns', data);
    return response.data;
  },
  
  // Mettre à jour une campagne
  async updateCampaign(id, data) {
    const response = await api.put(`/campaigns/${id}`, data);
    return response.data;
  },
  
  // Supprimer une campagne
  async deleteCampaign(id) {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },
  
  // Démarrer une campagne
  async startCampaign(id) {
    const response = await api.post(`/campaigns/${id}/start`);
    return response.data;
  },
  
  // Pause d'une campagne
  async pauseCampaign(id) {
    const response = await api.post(`/campaigns/${id}/pause`);
    return response.data;
  },
  
  // Arrêter une campagne
  async stopCampaign(id) {
    const response = await api.post(`/campaigns/${id}/stop`);
    return response.data;
  },
  
  // Récupérer les statistiques d'une campagne
  async getCampaignStats(id) {
    const response = await api.get(`/campaigns/${id}/stats`);
    return response.data;
  },
  
  // Dupliquer une campagne
  async duplicateCampaign(id) {
    const response = await api.post(`/campaigns/${id}/duplicate`);
    return response.data;
  },
  
  // Exporter les résultats d'une campagne
  async exportCampaignResults(id, format = 'csv') {
    const response = await api.get(`/campaigns/${id}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }
};