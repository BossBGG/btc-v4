import { createContext, useEffect, useState, ReactNode } from 'react';

const LOCAL_STORAGE_KEY = 'authData';

// Define user role types
export type UserRole = 'student' | 'staff' | 'admin';

interface UserData {
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
  hasAccess: (allowedRoles: UserRole[]) => boolean; // เพิ่มฟังก์ชันตรวจสอบสิทธิ์
}

export const AuthStore = createContext<AuthStateProps | undefined>(undefined);

export const AuthStoreProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

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

  const login = (user: UserData, token: string) => {
    console.log('Login with user:', user);
    
    setIsAuthenticated(true);
    setUserRole(user.role);
    setUserId(user.id);
    setStudentId(user.studentId);
    setUserData(user);
    
    // Get refresh token if available
    const refreshToken = localStorage.getItem('refreshToken') || undefined;
    
    // Save auth data to localStorage
    const authData: AuthData = { 
      user,
      token,
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
      hasAccess // เพิ่มฟังก์ชันตรวจสอบสิทธิ์ในค่าที่ส่งออก
    }}>
      {children}
    </AuthStore.Provider>
  );
};