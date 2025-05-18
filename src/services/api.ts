// src/services/api.ts
import axios from 'axios';

// ตรวจสอบให้แน่ใจว่า baseURL ตรงกับที่เห็นใน Swagger
const api = axios.create({
  baseURL: 'https://bootcampp.karinwdev.site', // ตรงตาม URL ใน Swagger
  headers: {
    'Content-Type': 'application/json',
  },
});

// เพิ่ม interceptor สำหรับแนบ token อัตโนมัติกับทุก request
api.interceptors.request.use(
  (config) => {
    // ดึง token จาก localStorage
    try {
      const authData = localStorage.getItem('authData');
      if (authData) {
        const { token } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error reading token from localStorage:', error);
    }
    
    // แก้ไขการใช้ substring เพื่อหลีกเลี่ยง TypeScript error
    const authHeader = config.headers.Authorization;
    const authHeaderStr = authHeader ? 
      (typeof authHeader === 'string' ? 
        `Auth header: ${authHeader.substring(0, 20)}...` : 
        `Auth header: ${String(authHeader).substring(0, 20)}...`) : 
      'No Auth header';
      
    console.log(`Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      config.data, 
      authHeaderStr);
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