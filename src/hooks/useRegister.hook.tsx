// src/hooks/useRegister.hook.tsx
import { useState } from "react";
import { register, RegisterPayload, RegisterResult } from "../services/register";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (userData: RegisterPayload): Promise<RegisterResult | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Basic validation
      if (userData.password !== userData.confirmPassword) {
        setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
        return null;
      }
      
      if (userData.password.length < 6) {
        setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
        return null;
      }
      
      if (!/^\d{8}$/.test(userData.studentId)) {
        setError('รหัสนิสิตต้องเป็นตัวเลข 8 หลัก');
        return null;
      }

      const result = await register(userData);
      
      if (result.error) {
        setError(result.error);
        return null;
      }
      
      return result;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    registerUser,
    loading,
    error
  };
};