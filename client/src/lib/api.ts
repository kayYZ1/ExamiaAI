import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'prod_url'
    : 'http://localhost:7676';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
