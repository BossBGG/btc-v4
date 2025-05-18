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

// Get user profile data from the API
export const getUserProfile = async (accessToken?: string) => {
  try {
    // If no token provided, try to get it from localStorage
    if (!accessToken) {
      const authData = localStorage.getItem('authData');
      if (authData) {
        const { token } = JSON.parse(authData);
        accessToken = token;
      }
    }

    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    console.log('Fetching user profile with token:', accessToken ? 'present' : 'missing');
    
    const result = await api.get('/auth/me');
    console.log('User profile API response:', result.data);
    
    return result.data;
  } catch (error: any) {
    console.error('Get profile error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 401) {
      // Clear invalid auth data
      localStorage.removeItem('authData');
      throw new Error('Token has expired or is invalid');
    }
    
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    
    throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
  }
};

// Update user profile in the API
export const updateUserProfile = async (accessToken: string, userData: Partial<LoginResponse['user']>) => {
  try {
    const result = await api.put('/auth/me', userData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return result.data;
  } catch (error: any) {
    console.error('Update profile error:', error);
    
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    
    throw new Error('เกิดข้อผิดพลาดในการอัพเดทข้อมูลผู้ใช้');
  }
};