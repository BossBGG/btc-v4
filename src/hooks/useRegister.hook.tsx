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
      
      // ตรวจสอบข้อมูลก่อนส่งไปที่ API
      if (userData.password !== userData.confirmPassword) {
        setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
        setLoading(false);
        return null;
      }
      
      if (userData.password.length < 6) {
        setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
        setLoading(false);
        return null;
      }
      
      if (!/^\d{8}$/.test(userData.studentId)) {
        setError('รหัสนิสิตต้องเป็นตัวเลข 8 หลัก');
        setLoading(false);
        return null;
      }

      // เรียกใช้ API สมัครสมาชิก
      const result = await register(userData);
      
      // ตรวจสอบผลลัพธ์ที่ได้รับ
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return null;
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      console.error('Registration error in hook:', err);
      
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง'
      );
      setLoading(false);
      return null;
    }
  };

  return {
    registerUser,
    loading,
    error
  };
};