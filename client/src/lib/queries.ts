import api from './api';

export const getUser = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const getSets = async () => {
  const response = await api.get('/set');
  return response.data;
};
