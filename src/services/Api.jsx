import axios from 'axios';
import baseUrl from './BaseUrl';

const api = axios.create({
  baseURL: baseUrl,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
