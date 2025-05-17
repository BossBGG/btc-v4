// src/services/userService.ts
import api from './api';

// ฟังก์ชันเปลี่ยนสิทธิ์ผู้ใช้งาน
export const updateUserRole = async (userId: string, role: 'student' | 'staff') => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw error;
  }
};