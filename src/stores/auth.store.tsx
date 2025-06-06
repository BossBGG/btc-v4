// src/stores/auth.store.tsx
import { createContext, useEffect, useState, ReactNode } from 'react';

const LOCAL_STORAGE_KEY = 'authData';

// Define user role types
export type UserRole = 'student' | 'staff' | 'admin';

export interface UserData {
  id: string;
  studentId: string;
  role: UserRole;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthData {
  user: UserData;
  token: string;
  refreshToken?: string;
}

interface AuthStateProps {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userId: string | null;
  studentId: string | null;
  userData: UserData | null;
  login: (userData: UserData, token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
  hasAccess: (allowedRoles: UserRole[]) => boolean;
  getToken: () => string | null;
}

export const AuthStore = createContext<AuthStateProps | undefined>(undefined);

export const AuthStoreProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ฟังก์ชันใหม่เพื่อเรียกใช้ token
  const getToken = (): string | null => {
    try {
      const storedAuth = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedAuth) {
        const authData: AuthData = JSON.parse(storedAuth);
        return authData.token || null;
      }
      return token;
    } catch (e) {
      console.error("Error getting token:", e);
      return null;
    }
  };

  // Check authentication status from localStorage
  const checkAuth = (): boolean => {
    try {
      const storedAuth = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedAuth) {
        const authData: AuthData = JSON.parse(storedAuth);
        
        if (authData && authData.user && authData.token) {
          // Store the refresh token separately for API usage
          if (authData.refreshToken) {
            localStorage.setItem('refreshToken', authData.refreshToken);
          }
          
          setIsAuthenticated(true);
          setUserRole(authData.user.role);
          setUserId(authData.user.id);
          setStudentId(authData.user.studentId);
          setUserData(authData.user);
          setToken(authData.token);
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error("Error checking auth state:", e);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem('refreshToken');
      return false;
    }
  };

  // ฟังก์ชันตรวจสอบสิทธิ์การเข้าถึงตาม role
  const hasAccess = (allowedRoles: UserRole[]): boolean => {
    // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบหรือไม่ และมี role ที่อนุญาตหรือไม่
    return isAuthenticated && userRole !== null && allowedRoles.includes(userRole);
  };

  useEffect(() => {
    // Load auth data on application start
    checkAuth();
  }, []);

  const login = (user: UserData, accessToken: string) => {
    console.log('Login with user:', user);
    
    setIsAuthenticated(true);
    setUserRole(user.role);
    setUserId(user.id);
    setStudentId(user.studentId);
    setUserData(user);
    setToken(accessToken);
    
    // Get refresh token if available
    const refreshToken = localStorage.getItem('refreshToken') || undefined;
    
    // Save auth data to localStorage
    const authData: AuthData = { 
      user,
      token: accessToken,
      refreshToken
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setStudentId(null);
    setUserData(null);
    setToken(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthStore.Provider value={{ 
      isAuthenticated, 
      userRole, 
      userId, 
      studentId,
      userData,
      login, 
      logout, 
      checkAuth,
      hasAccess,
      getToken
    }}>
      {children}
    </AuthStore.Provider>
  );
};