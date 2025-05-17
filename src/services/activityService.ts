// src/services/activityService.ts
import api from './api';

// ฟังก์ชันดึงข้อมูลกิจกรรมทั้งหมด
export const getAllActivities = async (token: string) => {
  try {
    const response = await api.get('/api/activities', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return { activities: [] }; // คืนค่า array ว่างถ้าเกิดข้อผิดพลาด
  }
};

// ฟังก์ชันดึงข้อมูลกิจกรรมตาม ID
export const getActivityById = async (id: string | number, token: string) => {
  try {
    const response = await api.get(`/api/activities/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching activity with ID ${id}:`, error);
    return null;
  }
};

// ฟังก์ชันค้นหากิจกรรม
export const searchActivities = async (searchTerm: string, token: string) => {
  try {
    // สร้าง URL สำหรับการค้นหา
    const url = `/api/activities?search=${encodeURIComponent(searchTerm)}`;
    
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching activities:', error);
    return { activities: [] };
  }
};

// ฟังก์ชันกรองกิจกรรมตามประเภท
export const getActivitiesByType = async (typeId: number, token: string) => {
  try {
    const response = await api.get(`/api/activities?typeId=${typeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching activities by type ${typeId}:`, error);
    return { activities: [] };
  }
};

// ฟังก์ชันลงทะเบียนเข้าร่วมกิจกรรม
export const registerForActivity = async (activityId: number, token: string) => {
  try {
    const response = await api.post(`/api/activities/${activityId}/register`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error registering for activity ${activityId}:`, error);
    throw error; // โยน error เพื่อให้คอมโพเนนต์จัดการได้
  }
};

// Helper functions สำหรับการกรองกิจกรรม
// กรองเฉพาะกิจกรรมที่มีสถานะ "approved" สำหรับผู้ใช้ทั่วไป
export const filterApprovedActivities = (activities: any[]) => {
  return activities.filter(activity => activity.status === 'approved');
};

// กรองกิจกรรมที่ไม่ได้อยู่ในสถานะ closed หรือ cancelled
export const filterActiveActivities = (activities: any[]) => {
  return activities.filter(activity => 
    activity.status === 'approved' && 
    activity.status !== 'closed' && 
    activity.status !== 'cancelled'
  );
};

// แปลงเวลาให้อยู่ในรูปแบบที่อ่านง่าย
export const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes} น.`;
};