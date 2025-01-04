import api from './api';

export const getUser = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const getSets = async () => {
  const response = await api.get('/set');
  return response.data;
};

export const getSet = async (setId: string) => {
  const response = await api.get(`/set/${setId}`);
  return response.data;
};

export const getQuestions = async (setId: string) => {
  const response = await api.get(`/question/${setId}`);
  return response.data;
};
