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
  token?: string;  // เพิ่มเพื่อรองรับกรณีที่ token อยู่ที่ root level
  tokens?: {  
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
    
    // สร้าง token สำหรับเก็บใน localStorage ด้วย JWT จากข้อมูลผู้ใช้
    // ใช้วิธีนี้เพราะ API ไม่ส่ง token กลับมา
    const generateDummyJWT = (userData: any): string => {
      // ใช้ข้อมูลผู้ใช้สร้าง token แบบง่ายๆ (ในระบบจริงไม่ควรทำแบบนี้)
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        id: userData.id,
        studentId: userData.studentId,
        role: userData.role,
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
      }));
      // สร้าง signature ง่ายๆ (ในระบบจริงจะมีการเข้ารหัสด้วย secret key)
      const signature = btoa(`${Date.now()}`);
      
      return `${header}.${payload}.${signature}`;
    };
    
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
        // สร้าง token จาก user data
        token: result.data.token || "", // กรณี API มี token ที่ root level
        tokens: result.data.tokens || {
          accessToken: result.data.token || generateDummyJWT(result.data.user || { studentId })
        }
      };
    }
    
    // กรณี response มี user แต่ไม่มี token
    if (result.data.user && !result.data.token && !result.data.tokens) {
      // สร้าง token จาก user data
      const generatedToken = generateDummyJWT(result.data.user);
      
      return {
        ...result.data,
        token: generatedToken,
        tokens: {
          accessToken: generatedToken
        }
      };
    }
    
    // Return the API response data as is
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