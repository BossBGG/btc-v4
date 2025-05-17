import { useContext } from "react";
import { AuthStore, UserRole } from "../stores/auth.store";
import { loginApi, LoginPayload, LoginResponse } from "../services/authService";

export interface UserData {
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
    
    // ถ้าไม่มี error และมี user
    if (!result.error && result.user) {
      // เตรียมข้อมูล user
      const userData: UserData = {
        id: typeof result.user.id === 'number' ? result.user.id.toString() : result.user.id || '',
        studentId: result.user.studentId || credentials.studentId,
        role: result.user.role || 'student',
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName
      };
      
      // ถ้าไม่มี tokens แต่ login สำเร็จ
      const token = result.tokens?.accessToken || `dummy_token_${Date.now()}`;
      
      // Update auth context with user info and access token
      context.login(userData, token);
      
      // Store refresh token in localStorage if available
      if (result.tokens?.refreshToken) {
        localStorage.setItem('refreshToken', result.tokens.refreshToken);
      }
    }
    
    return result;
  } catch (error) {
    console.error("Login hook error:", error);
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
  
  return {
    ...context,
    handleLogin
  };
};

export { loginApi };
export type { LoginPayload };