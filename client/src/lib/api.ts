import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://examiaai-production.up.railway.app'
    : 'http://localhost:7676';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
