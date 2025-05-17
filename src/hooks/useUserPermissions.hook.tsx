// src/hooks/useUserPermissions.hook.tsx
import { useState } from 'react';
import { updateUserRole } from '../services/userService';

export const useUserPermissions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ฟังก์ชันแต่งตั้งเป็น staff
  const appointAsStaff = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateUserRole(userId, 'staff');
      return result;
    } catch (err: any) {
      console.error('Error appointing staff:', err);
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการแต่งตั้งเป็นเจ้าหน้าที่ โปรดลองอีกครั้ง'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันยกเลิกสิทธิ์ staff กลับเป็นนิสิต
  const revokeStaffPermission = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateUserRole(userId, 'student');
      return result;
    } catch (err: any) {
      console.error('Error revoking staff permission:', err);
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการยกเลิกสิทธิ์เจ้าหน้าที่ โปรดลองอีกครั้ง'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    appointAsStaff,
    revokeStaffPermission
  };
};

export default useUserPermissions;