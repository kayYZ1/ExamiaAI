import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7676',
  withCredentials: true,
});

export default api;
