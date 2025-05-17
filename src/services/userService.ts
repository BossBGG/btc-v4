// src/services/userService.ts
import api from './api';

// ฟังก์ชันเปลี่ยนสิทธิ์ผู้ใช้งาน
export const updateUserRole = async (userId: string, role: 'student' | 'staff') => {
    try {
      // ปรับ path ให้ถูกต้องตามที่ API กำหนด ตามรูปภาพที่ให้มา
      const response = await api.put(`/api/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };
  
  // เพิ่มฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมด
  export const getAllUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };