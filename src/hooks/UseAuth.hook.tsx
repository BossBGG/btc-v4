// src/hooks/UseAuth.hook.tsx
import { useContext } from "react";
import { AuthStore, UserRole } from "../stores/auth.store";
import { loginApi, LoginPayload, LoginResponse } from "../services/authService";

// นิยาม UserData interface ใหม่ในไฟล์นี้เพื่อหลีกเลี่ยง conflict
interface AuthUserData {
  id: string;
  studentId: string;
  role: UserRole;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export const useAuth = () => {
  const context = useContext(AuthStore);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Add a wrapper function for login that handles the API call
  const handleLogin = async (credentials: LoginPayload): Promise<LoginResponse> => {
    try {
      const result = await loginApi(credentials);
      
      console.log("Login API response full:", result); // ดูข้อมูลทั้งหมดที่ได้รับ
      
      // ถ้าไม่มี error และมี user
      if (!result.error && result.user) {
        // เตรียมข้อมูล user
        const userData: AuthUserData = {
          id: typeof result.user.id === 'number' ? result.user.id.toString() : result.user.id || '',
          studentId: result.user.studentId || credentials.studentId,
          role: result.user.role || 'student',
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName
        };
        
        // ใช้ token จาก API response หรือสร้างขึ้นใหม่
        const token = result.token || result.tokens?.accessToken || '';
        
        if (!token) {
          console.warn("ไม่พบ token ในผลลัพธ์การล็อกอิน - สร้าง token จาก user data");
        } else {
          console.log("ได้รับ token:", token.substring(0, 20) + "...");
        }
        
        // Update auth context with user info and access token
        context.login(userData, token);
        
        // Store refresh token in localStorage if available
        if (result.tokens?.refreshToken) {
          localStorage.setItem('refreshToken', result.tokens.refreshToken);
        }
      } else {
        console.error("ไม่สามารถล็อกอินได้:", result.error || "ไม่พบข้อมูลผู้ใช้");
      }
      
      return result;
    } catch (error: any) {
      console.error("Login hook error:", error);
      return {
        user: {
          id: '',
          studentId: '',
          role: 'student'
        },
        error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง'
      };
    }
  };
  
  return {
    ...context,
    handleLogin
  };
};

export { loginApi };
export type { LoginPayload };