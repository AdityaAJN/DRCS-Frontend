import api from './api';

export const inventoryService = {
  getAllInventory: async () => {
    const response = await api.get('/inventory');
    return response.data;
  },

  getMyInventory: async () => {
    const response = await api.get('/inventory/my-inventory');
    return response.data;
  },

  addInventoryItem: async (itemData) => {
    const response = await api.post('/inventory', itemData);
    return response.data;
  },

  deleteInventoryItem: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
};