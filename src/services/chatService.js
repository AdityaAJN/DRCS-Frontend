import api from './api';

export const chatService = {
  sendMessage: async (messageData) => {
    const response = await api.post('/chat/send', messageData);
    return response.data;
  },

  getConversation: async (userId) => {
    const response = await api.get(`/chat/conversation/${userId}`);
    return response.data;
  },

  getHelpRequestChat: async (helpRequestId) => {
    const response = await api.get(`/chat/request/${helpRequestId}`);
    return response.data;
  },
};