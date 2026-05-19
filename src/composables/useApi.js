import { ref } from 'vue';
import api from '../services/api';
import { useToast } from 'vue-toastification';

export function useApi() {
  const loading = ref(false);
  const error = ref(null);
  const toast = useToast();
  
  const execute = async (request, showSuccess = false, successMessage = '') => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await request();
      if (showSuccess && successMessage) {
        toast.success(successMessage);
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    loading,
    error,
    execute,
  };
}