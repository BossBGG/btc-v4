// src/services/api.ts
import axios from 'axios';

// ตรวจสอบให้แน่ใจว่า baseURL ตรงกับที่เห็นใน Swagger
const api = axios.create({
  baseURL: 'https://bootcampp.karinwdev.site', // ตรงตาม URL ใน Swagger
  headers: {
    'Content-Type': 'application/json',
  },
});

// เพิ่ม Axios Request Logger เพื่อช่วยดีบัก
api.interceptors.request.use(
  (config) => {
    console.log(`Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// เพิ่ม Axios Response Logger เพื่อช่วยดีบัก
api.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Error Response:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;