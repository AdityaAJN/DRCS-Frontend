import api from './api';

export const shelterService = {
  getAllShelters: async () => {
    const response = await api.get('/shelters');
    return response.data;
  },

  createShelter: async (shelterData) => {
    const response = await api.post('/shelters', shelterData);
    return response.data;
  },

  updateOccupancy: async (id, occupancy) => {
    const response = await api.patch(`/shelters/${id}/occupancy?occupancy=${occupancy}`);
    return response.data;
  },

  deleteShelter: async (id) => {
    const response = await api.delete(`/shelters/${id}`);
    return response.data;
  },
};