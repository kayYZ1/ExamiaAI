import api from './api';

export const getUser = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};
