// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bootcampp.karinwdev.site/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;