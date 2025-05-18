// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bootcampp.karinwdev.site/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to automatically add auth token
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('authData');
  console.log('Request interceptor - Auth data:', authData ? 'present' : 'missing');
  
  if (authData) {
    try {
      const { token } = JSON.parse(authData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Request interceptor - Added token to request');
      } else {
        console.warn('Request interceptor - No token in auth data');
      }
    } catch (e) {
      console.error('Request interceptor - Error parsing auth data:', e);
    }
  }
  return config;
}, (error) => {
  console.error('Request interceptor - Error:', error);
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url} success:`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error(`API ${error.config?.method?.toUpperCase()} ${error.config?.url} error:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      headers: error.config?.headers
    });
    return Promise.reject(error);
  }
);

export default api;