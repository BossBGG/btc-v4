// src/services/eventService.ts
import api from './api';

// ข้อมูลสำหรับสร้างกิจกรรมใหม่
export interface CreateEventPayload {
  title: string;
  description: string;
  typeId: string;
  location: string;
  startTime: string; // ในรูปแบบตามที่ API ต้องการ (RFC 3339)
  endTime: string;   // ในรูปแบบตามที่ API ต้องการ (RFC 3339)
  maxParticipants: number;
  imageUrl?: string;
}

// รูปแบบข้อมูลที่ได้รับจาก API
export interface Event {
  id: string;
  title: string;
  description: string;
  typeId: string;
  eventType: 'อบรม' | 'อาสา' | 'ช่วยงาน';
  location: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  approvalStatus: 'อนุมัติ' | 'รออนุมัติ' | 'ไม่อนุมัติ';
  status: 'รับสมัคร' | 'กำลังดำเนินการ' | 'เสร็จสิ้น' | 'ยกเลิก';
  participants: number;
  createdBy: string;
  score: number;
  hours: number;
  imageUrl: string;
}

// ฟังก์ชันเรียก API สร้างกิจกรรมใหม่
export const createEvent = async (eventData: CreateEventPayload) => {
  try {
    const response = await api.post('/api/activities', eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันดึงข้อมูลกิจกรรมทั้งหมด
export const getAllEvents = async () => {
  try {
    const response = await api.get('/api/activities');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันดึงข้อมูลกิจกรรมตาม ID
export const getEventById = async (id: string) => {
  try {
    const response = await api.get(`/api/activities/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันดึงข้อมูลกิจกรรมที่สร้างโดยเจ้าหน้าที่ที่ระบุ
export const getEventsByStaffId = async (staffId: string) => {
  try {
    const response = await api.get(`/api/activities?createdBy=${staffId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันดึงข้อมูลกิจกรรมตามประเภท
export const getEventsByType = async (typeId: string) => {
  try {
    const response = await api.get(`/api/activities?typeId=${typeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันอัพเดทข้อมูลกิจกรรม
export const updateEvent = async (id: string, eventData: Partial<CreateEventPayload>) => {
  try {
    const response = await api.put(`/api/activities/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันอัพเดทสถานะกิจกรรม
export const updateEventStatus = async (id: string, status: string) => {
  try {
    const response = await api.patch(`/api/activities/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันอัพเดทสถานะการอนุมัติกิจกรรม
export const updateEventApprovalStatus = async (id: string, approvalStatus: string) => {
  try {
    const response = await api.patch(`/api/activities/${id}/approval`, { approvalStatus });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันค้นหากิจกรรม
export const searchEvents = async (query: string, filters: any = {}) => {
  try {
    let url = `/api/activities/search?q=${encodeURIComponent(query)}`;
    
    // เพิ่ม filters ต่างๆ เข้าไปใน URL
    if (filters.typeId) {
      url += `&typeId=${filters.typeId}`;
    }
    if (filters.startDate) {
      url += `&startFrom=${filters.startDate}`;
    }
    if (filters.endDate) {
      url += `&endBefore=${filters.endDate}`;
    }
    if (filters.status) {
      url += `&status=${filters.status}`;
    }
    if (filters.approvalStatus) {
      url += `&approvalStatus=${filters.approvalStatus}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Helper function สำหรับการแปลงรูปแบบวันที่จาก DD/MM/YYYY เป็น RFC 3339
export const formatDateToRFC3339 = (dateString: string, timeString: string = '00:00') => {
  if (!dateString) return '';
  
  const [day, month, year] = dateString.split('/').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // สร้าง Date object (ปี ค.ศ.)
  const date = new Date(year - 543, month - 1, day, hours, minutes);
  
  // แปลงเป็นรูปแบบ RFC 3339
  return date.toISOString();
};

// Helper function สำหรับการแปลงรูปแบบวันที่จาก RFC 3339 เป็น DD/MM/YYYY
export const formatRFC3339ToDate = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // แปลงเป็นรูปแบบ DD/MM/YYYY (ปี พ.ศ.)
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
  
  return `${day}/${month}/${year}`;
};

// Helper function สกัดเวลาจาก RFC 3339
export const extractTimeFromRFC3339 = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // แปลงเป็นรูปแบบ HH:MM
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

// แปลง typeId เป็น eventType ที่แสดงผล
export const typeIdToEventType = (typeId: string): 'อบรม' | 'อาสา' | 'ช่วยงาน' => {
  switch (typeId) {
    case 'training':
      return 'อบรม';
    case 'volunteer':
      return 'อาสา';
    case 'helper':
      return 'ช่วยงาน';
    default:
      return 'อบรม';
  }
};

// แปลง eventType เป็น typeId
export const eventTypeToTypeId = (eventType: string): string => {
  switch (eventType) {
    case 'อบรม':
      return 'training';
    case 'อาสา':
      return 'volunteer';
    case 'ช่วยงาน':
      return 'helper';
    default:
      return 'training';
  }
};