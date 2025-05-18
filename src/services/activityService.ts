// src/services/activityService.ts
import api from './api';

// ฟังก์ชันดึงข้อมูลกิจกรรมทั้งหมด
export const getAllActivities = async (token: string = '') => {
  try {
    let headers = {};
    
    // ถ้าไม่มี token ที่ส่งมา ลองดึงจาก localStorage
    if (!token) {
      const authData = localStorage.getItem('authData');
      if (authData) {
        try {
          const parsedAuthData = JSON.parse(authData);
          if (parsedAuthData && parsedAuthData.token) {
            token = parsedAuthData.token;
          }
        } catch (e) {
          console.error('Failed to parse auth data:', e);
        }
      }
    }
    
    // ถ้ามี token ให้เพิ่มใน headers
    if (token) {
      headers = {
        Authorization: `Bearer ${token}`
      };
    }
    
    const response = await api.get('/api/activities', { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return { activities: [] }; // คืนค่า array ว่างถ้าเกิดข้อผิดพลาด
  }
};

// ฟังก์ชันดึงข้อมูลกิจกรรมตาม ID
export const getActivityById = async (id: string | number, token: string = '') => {
  try {
    let headers = {};
    
    // ถ้าไม่มี token ที่ส่งมา ลองดึงจาก localStorage
    if (!token) {
      const authData = localStorage.getItem('authData');
      if (authData) {
        try {
          const parsedAuthData = JSON.parse(authData);
          if (parsedAuthData && parsedAuthData.token) {
            token = parsedAuthData.token;
          }
        } catch (e) {
          console.error('Failed to parse auth data:', e);
        }
      }
    }
    
    // ถ้ามี token ให้เพิ่มใน headers
    if (token) {
      headers = {
        Authorization: `Bearer ${token}`
      };
    }
    
    const response = await api.get(`/api/activities/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching activity with ID ${id}:`, error);
    return null;
  }
};

// ฟังก์ชันค้นหากิจกรรม
export const searchActivities = async (searchTerm: string, token: string = '') => {
  try {
    let headers = {};
    
    // ถ้าไม่มี token ที่ส่งมา ลองดึงจาก localStorage
    if (!token) {
      const authData = localStorage.getItem('authData');
      if (authData) {
        try {
          const parsedAuthData = JSON.parse(authData);
          if (parsedAuthData && parsedAuthData.token) {
            token = parsedAuthData.token;
          }
        } catch (e) {
          console.error('Failed to parse auth data:', e);
        }
      }
    }
    
    // ถ้ามี token ให้เพิ่มใน headers
    if (token) {
      headers = {
        Authorization: `Bearer ${token}`
      };
    }
    
    // สร้าง URL สำหรับการค้นหา
    const url = `/api/activities?search=${encodeURIComponent(searchTerm)}`;
    
    const response = await api.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error searching activities:', error);
    return { activities: [] };
  }
};

// ฟังก์ชันกรองกิจกรรมตามประเภท
export const getActivitiesByType = async (typeId: number, token: string = '') => {
  try {
    let headers = {};
    
    // ถ้าไม่มี token ที่ส่งมา ลองดึงจาก localStorage
    if (!token) {
      const authData = localStorage.getItem('authData');
      if (authData) {
        try {
          const parsedAuthData = JSON.parse(authData);
          if (parsedAuthData && parsedAuthData.token) {
            token = parsedAuthData.token;
          }
        } catch (e) {
          console.error('Failed to parse auth data:', e);
        }
      }
    }
    
    // ถ้ามี token ให้เพิ่มใน headers
    if (token) {
      headers = {
        Authorization: `Bearer ${token}`
      };
    }
    
    const response = await api.get(`/api/activities?typeId=${typeId}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching activities by type ${typeId}:`, error);
    return { activities: [] };
  }
};

// ฟังก์ชันลงทะเบียนเข้าร่วมกิจกรรม
export const registerForActivity = async (activityId: number, token: string = '') => {
  try {
    let headers = {};
    
    // ถ้าไม่มี token ที่ส่งมา ลองดึงจาก localStorage
    if (!token) {
      const authData = localStorage.getItem('authData');
      if (authData) {
        try {
          const parsedAuthData = JSON.parse(authData);
          if (parsedAuthData && parsedAuthData.token) {
            token = parsedAuthData.token;
          }
        } catch (e) {
          console.error('Failed to parse auth data:', e);
        }
      }
    }
    
    // ถ้ามี token ให้เพิ่มใน headers
    if (token) {
      headers = {
        Authorization: `Bearer ${token}`
      };
    } else {
      throw new Error('No authentication token available');
    }
    
    const response = await api.post(`/api/activities/${activityId}/register`, {}, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error registering for activity ${activityId}:`, error);
    throw error; // โยน error เพื่อให้คอมโพเนนต์จัดการได้
  }
};

// Helper functions สำหรับการกรองกิจกรรม
// กรองเฉพาะกิจกรรมที่มีสถานะ "approved" สำหรับผู้ใช้ทั่วไป
export const filterApprovedActivities = (activities: any[]) => {
  if (!Array.isArray(activities)) return [];
  return activities.filter(activity => activity.status === 'approved');
};

// กรองกิจกรรมที่ไม่ได้อยู่ในสถานะ closed หรือ cancelled
export const filterActiveActivities = (activities: any[]) => {
  if (!Array.isArray(activities)) return [];
  return activities.filter(activity => 
    activity.status !== 'closed' && 
    activity.status !== 'cancelled'
  );
};

// แปลงเวลาให้อยู่ในรูปแบบที่อ่านง่าย
export const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes} น.`;
};