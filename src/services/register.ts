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
    // ตรวจสอบข้อมูลก่อนส่งไป API
    console.log('Sending registration data:', payload);
    
    // แน่ใจว่าส่งไปที่ endpoint ที่ถูกต้อง (ตามที่เห็นใน Image 1)
    const result = await api.post('/api/auth/register', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful response:', result.data);
    
    // Return the API response data
    return result.data;
    
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // แสดงข้อมูล error ที่ละเอียดมากขึ้น
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      
      // ตรวจสอบข้อมูล error ที่ได้รับจาก API
      if (error.response.data) {
        return {
          message: error.response.data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน',
          user: { id: '', studentId: '', role: 'student' },
          error: error.response.data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน'
        };
      }
    }
    
    // Default error response
    return {
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน',
      user: { id: '', studentId: '', role: 'student' },
      error: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง'
    };
  }
};