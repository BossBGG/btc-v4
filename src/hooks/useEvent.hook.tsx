// src/hooks/useEvent.hook.tsx
import { useState } from 'react';
import { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  getEventsByStaffId,
  getEventsByType,
  updateEvent,
  updateEventStatus,
  updateEventApprovalStatus,
  searchEvents,
  Event,
  CreateEventPayload
} from '../services/eventService';

export const useEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // สร้างกิจกรรมใหม่
  const createNewEvent = async (eventData: CreateEventPayload) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createEvent(eventData);
      return result;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการสร้างกิจกรรม โปรดลองอีกครั้ง'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลกิจกรรมทั้งหมด
  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllEvents();
      return result;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม โปรดลองอีกครั้ง'
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลกิจกรรมตาม ID
  const fetchEventById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getEventById(id);
      return result;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม โปรดลองอีกครั้ง'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลกิจกรรมที่สร้างโดยเจ้าหน้าที่
  const fetchEventsByStaffId = async (staffId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getEventsByStaffId(staffId);
      return result;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม โปรดลองอีกครั้ง'
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลกิจกรรมตามประเภท
  const fetchEventsByType = async (typeId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getEventsByType(typeId);
      return result;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม โปรดลองอีกครั้ง'
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  // อัพเดทข้อมูลกิจกรรม
  const updateEventData = async (id: string, eventData: Partial<CreateEventPayload>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateEvent(id, eventData);
      return result;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการอัพเดทข้อมูลกิจกรรม โปรดลองอีกครั้ง'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // อัพเดทสถานะกิจกรรม
  const updateStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateEventStatus(id, status);
      return result;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการอัพเดทสถานะกิจกรรม โปรดลองอีกครั้ง'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // อัพเดทสถานะการอนุมัติกิจกรรม
  const updateApprovalStatus = async (id: string, approvalStatus: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateEventApprovalStatus(id, approvalStatus);
      return result;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการอัพเดทสถานะการอนุมัติ โปรดลองอีกครั้ง'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ค้นหากิจกรรม
  const searchEventsByQuery = async (query: string, filters: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await searchEvents(query, filters);
      return result;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'เกิดข้อผิดพลาดในการค้นหากิจกรรม โปรดลองอีกครั้ง'
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createNewEvent,
    fetchAllEvents,
    fetchEventById,
    fetchEventsByStaffId,
    fetchEventsByType,
    updateEventData,
    updateStatus,
    updateApprovalStatus,
    searchEventsByQuery
  };
};

export default useEvent;