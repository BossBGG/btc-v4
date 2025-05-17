// src/services/register.ts
import api from './api';

export interface RegisterPayload {
  studentId: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  faculty?: string;
  major?: string;
}

export interface RegisterResult {
  message: string;
  user: {
    id: string | number;
    studentId: string;
    role: 'student' | 'staff' | 'admin';
  };
  error?: string;
}

export const register = async (payload: RegisterPayload): Promise<RegisterResult> => {
  try {
    // Call the real API endpoint for registration
    const result = await api.post('/auth/register', payload);
    
    // Return the API response data
    return result.data;
    
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Check if the error has a response with data from the API
    if (error.response && error.response.data) {
      return error.response.data;
    }
    
    // Default error response
    return {
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน',
      user: { id: '', studentId: '', role: 'student' },
      error: 'เกิดข้อผิดพลาดในการลงทะเบียน'
    };
  }
};