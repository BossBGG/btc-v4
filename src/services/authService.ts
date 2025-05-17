// src/services/authService.ts
import api from './api';

export interface LoginPayload {
  studentId: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  user: {
    id: string | number;
    studentId: string;
    role: 'student' | 'staff' | 'admin';
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
  error?: string;
}

// Call the API endpoint for authentication
export const loginApi = async ({ studentId, password }: LoginPayload): Promise<LoginResponse> => {
  try {
    // Call the real API login endpoint
    const result = await api.post('/auth/login', {
      studentId,
      password
    });
    
    // Return the API response data
    return result.data;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Check if the error has a response with data from the API
    if (error.response && error.response.data) {
      return error.response.data;
    }
    
    // Default error response
    return {
      user: {
        id: '',
        studentId: '',
        role: 'student'
      },
      tokens: {
        accessToken: ''
      },
      error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    };
  }
};