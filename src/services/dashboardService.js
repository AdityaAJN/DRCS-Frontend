import api from './api';

export const dashboardService = {
  getAnalytics: async () => {
    const response = await api.get('/dashboard/analytics');
    return response.data;
  },
};