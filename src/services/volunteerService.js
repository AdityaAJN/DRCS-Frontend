import api from './api';

export const volunteerService = {
  registerProfile: async (skills) => {
    const response = await api.post(`/volunteers/profile?skills=${encodeURIComponent(skills)}`);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get('/volunteers/me');
    return response.data;
  },

  updateAvailability: async (available) => {
    const response = await api.patch(`/volunteers/availability?available=${available}`);
    return response.data;
  },

  updateLocation: async (locationData) => {
    const response = await api.post('/volunteers/location', locationData);
    return response.data;
  },

  getAvailableVolunteers: async () => {
    const response = await api.get('/volunteers/available');
    return response.data;
  },

  getAllVolunteers: async () => {
    const response = await api.get('/volunteers');
    return response.data;
  },

  verifyVolunteer: async (id, status) => {
    const response = await api.patch(`/volunteers/${id}/verify?status=${status}`);
    return response.data;
  },
};