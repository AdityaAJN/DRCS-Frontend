import api from './api';

export const helpRequestService = {
  createHelpRequest: async (requestData) => {
    const response = await api.post('/help-requests', requestData);
    return response.data;
  },

  getMyHelpRequests: async () => {
    const response = await api.get('/help-requests/my-requests');
    return response.data;
  },

  getAllHelpRequests: async () => {
    const response = await api.get('/help-requests');
    return response.data;
  },

  getPriorityRequests: async () => {
    const response = await api.get('/help-requests/priority');
    return response.data;
  },

  assignVolunteer: async (requestId, volunteerId) => {
    const response = await api.put(`/help-requests/${requestId}/assign?volunteerId=${volunteerId}`);
    return response.data;
  },

  updateStatus: async (requestId, status) => {
    const response = await api.patch(`/help-requests/${requestId}/status?status=${status}`);
    return response.data;
  },
};