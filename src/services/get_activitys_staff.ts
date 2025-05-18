import api from './api';

export interface ParticipantItem {
  id: string;
  name: string;
  studentId: string;
  eventType: 'อบรม' | 'อาสา' | 'ช่วยงาน';
  eventTitle: string; // เพิ่มชื่อกิจกรรม
  faculty: string;
  major: string;
  registrationDate: string;
  attendanceStatus: "มาเข้าร่วม" | "ไม่ได้เข้าร่วม" | "รอเข้าร่วม";
}
  

// ประกาศ type สำหรับ pagination
type Pagination = {
  page: number;
  limit: number;
};



// ฟังก์ชันสำหรับเรียกข้อมูลกิจกรรม
export const getActivitiesApi = async (): Promise<any> => {
  const data = localStorage.getItem('authData');
  const parsedData = data ? JSON.parse(data) : null;
  const token = parsedData?.token || '';
  
  const response = await api.get(`/api/activities/participants`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  
  console.log('getActivitiesApi 1:', response.data);
  return response.data; // ส่งข้อมูลในรูปแบบ ActivityResponse
};