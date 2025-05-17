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
  tokens?: {  // เปลี่ยนเป็น optional เนื่องจากรูปแบบการตอบกลับอาจต่างจากที่คาดหวัง
    accessToken: string;
    refreshToken?: string;
  };
  error?: string;
}

// Call the API endpoint for authentication
export const loginApi = async ({ studentId, password }: LoginPayload): Promise<LoginResponse> => {
  try {
    // ตรวจสอบว่า endpoint ตรงกับที่เห็นในรูป Swagger
    const result = await api.post('/api/auth/login', {
      studentId,
      password
    });
    
    console.log('Login API response:', result.data); // เพิ่ม log เพื่อดูข้อมูลที่ได้รับจาก API
    
    // ถ้า response ไม่มี user หรือ tokens
    if (!result.data.user) {
      // ถ้า response มีรูปแบบต่างจากที่เราคาดหวัง ลองแก้ไขให้เข้ากับรูปแบบที่เราต้องการ
      return {
        message: result.data.message || "เข้าสู่ระบบสำเร็จ",
        user: result.data.user || {
          id: "unknown",
          studentId: studentId,
          role: "student",
          firstName: "",
          lastName: ""
        },
        tokens: {
          accessToken: result.data.token || "" // อาจมีชื่อ field ต่างกัน
        }
      };
    }
    
    // Return the API response data
    return result.data;
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Login error response:', error.response?.data);
    
    // ถ้ามี error.response แสดงว่าเซิร์ฟเวอร์ตอบกลับมาแต่มี error
    if (error.response) {
      // ถ้าเป็น Route not found
      if (error.response.status === 404) {
        console.error('API route not found. Check the endpoint URL');
        // ลองใช้ endpoint อื่น
        try {
          const retryResult = await api.post('/auth/login', {
            studentId,
            password
          });
          return retryResult.data;
        } catch (retryError) {
          console.error('Retry login failed:', retryError);
        }
      }
      
      // ถ้ามี response data ให้ใช้ข้อความ error จาก API
      if (error.response.data && error.response.data.message) {
        return {
          user: {
            id: '',
            studentId: '',
            role: 'student'
          },
          error: error.response.data.message
        };
      }
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
      error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาตรวจสอบ URL และข้อมูลที่ส่ง'
    };
  }
};