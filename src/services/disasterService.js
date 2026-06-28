import api from './api';

export const disasterService = {
  getActiveDisasters: async () => {
    const response = await api.get('/disasters/active');
    return response.data;
  },

  getAllDisasters: async () => {
    const response = await api.get('/disasters');
    return response.data;
  },

  createDisaster: async (disasterData) => {
    const response = await api.post('/disasters', disasterData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/disasters/${id}/status?status=${status}`);
    return response.data;
  },
};