import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../stores/theme.store';
import api from '../services/api';

// ประเภทของกิจกรรม
type EventType = 'อบรม' | 'อาสา' | 'ช่วยงาน';

// สถานะการอนุมัติ
type ApprovalStatus = 'อนุมัติ' | 'รออนุมัติ' | 'ไม่อนุมัติ';

// ข้อมูลสำหรับแก้ไขกิจกรรม
interface EventFormData {
  title: string;
  eventType: EventType;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  score: number;
  hours: number;
  image: File | null;
  previewImage: string | null;
  approvalStatus: ApprovalStatus;
}

function EditEventPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // state สำหรับจัดการข้อมูลฟอร์ม
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    eventType: 'อบรม',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '08:00',
    endTime: '16:00',
    location: '',
    maxParticipants: 0,
    score: 0,
    hours: 0,
    image: null,
    previewImage: null,
    approvalStatus: 'รออนุมัติ'
  });
  
  // state สำหรับจัดการข้อผิดพลาด
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // แปลงประเภทกิจกรรมเป็น typeId ตามที่ API ต้องการ
  const mapEventTypeToTypeId = (type: EventType): string => {
    switch (type) {
      case "อบรม":
        return "1";
      case "อาสา":
        return "2";
      case "ช่วยงาน":
        return "3";
      default:
        return "1";
    }
  };
  
  // โหลดข้อมูลกิจกรรมเดิมเมื่อเริ่มต้น component
useEffect(() => {
  // หากไม่มี id จาก URL params ให้ลองดึงจาก localStorage
  let activityId = id;
  if (!activityId) {
    const lastCreatedId = localStorage.getItem('lastCreatedActivityId');
    if (lastCreatedId) {
      activityId = lastCreatedId;
      // ทำการอัพเดท URL เพื่อให้ตรงกับข้อมูล
      navigate(`/edit-event/${lastCreatedId}`, { replace: true });
    } else {
      setApiError("ไม่พบรหัสกิจกรรมที่ต้องการแก้ไข");
      setIsLoading(false);
      return;
    }
  }
  
  // ฟังก์ชัน fetchEvent ที่แก้ไขปัญหา token
const fetchEvent = async () => {
  setIsLoading(true);
  
  try {
    // ดึง token จาก localStorage ที่ถูกต้อง
    const authData = localStorage.getItem("authData");
    if (!authData) {
      setApiError("ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่");
      setIsLoading(false);
      return;
    }

    // แปลงข้อมูล auth และดึง token
    const parsedAuthData = JSON.parse(authData);
    const token = parsedAuthData.token;
    
    if (!token) {
      setApiError("ไม่พบ token สำหรับการยืนยันตัวตน กรุณาเข้าสู่ระบบใหม่");
      setIsLoading(false);
      return;
    }

    console.log(`กำลังดึงข้อมูลกิจกรรมรหัส ${id} ด้วย token: ${token.substring(0, 15)}...`);
    
    // ในโปรเจคจริงควรเรียก API getEventById จาก eventService แต่เราเรียกใช้ api โดยตรง
    const response = await api.get(`/api/activities/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const eventData = response.data;
    console.log('ข้อมูลที่ได้รับจาก API:', eventData);
    
    // แปลงข้อมูลจาก API เป็นรูปแบบที่ฟอร์มต้องการ
    const startDate = formatISOToThai(eventData.startTime);
    const endDate = formatISOToThai(eventData.endTime);
    const startTime = extractTimeFromISO(eventData.startTime);
    const endTime = extractTimeFromISO(eventData.endTime);
    
    setFormData({
      title: eventData.title || '',
      eventType: mapTypeIdToEventType(eventData.type?.id?.toString() || "1"),
      description: eventData.description || '',
      startDate,
      endDate,
      startTime,
      endTime,
      location: eventData.location || '',
      maxParticipants: eventData.maxParticipants || 0,
      score: eventData.score || 0,
      hours: eventData.hours || 0,
      image: null,
      previewImage: eventData.imageUrl ? `https://bootcampp.karinwdev.site${eventData.imageUrl}` : null,
      approvalStatus: eventData.approvalStatus || 'รออนุมัติ'
    });
    
    setIsLoading(false);
  } catch (error: any) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม:', error);
    
    // แสดงรายละเอียดข้อผิดพลาดให้ละเอียดมากขึ้น
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      
      if (error.response.status === 401) {
        setApiError("ไม่มีสิทธิ์ในการดูข้อมูลกิจกรรม หรือ token หมดอายุ กรุณาเข้าสู่ระบบใหม่");
      } else if (error.response.status === 404) {
        setApiError(`ไม่พบกิจกรรมรหัส ${id}`);
      } else {
        setApiError(error.response.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } else {
      setApiError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
    
    // สร้างข้อมูลตัวอย่างสำหรับการทดสอบ UI เพื่อผู้ใช้ยังสามารถดำเนินการต่อได้
    const mockEventData = {
      title: `กิจกรรม ${id}`,
      eventType: Number(id) % 3 === 0 ? 'ช่วยงาน' : Number(id) % 2 === 0 ? 'อาสา' : 'อบรม' as EventType,
      description: `รายละเอียดกิจกรรม ${id} ที่กำลังแก้ไข ซึ่งเป็นข้อมูลตัวอย่างสำหรับการทดสอบ`,
      startDate: '01/06/2568',
      endDate: '02/06/2568',
      startTime: '09:00',
      endTime: '17:00',
      location: 'อาคาร IT มหาวิทยาลัย',
      maxParticipants: 30 + Number(id),
      score: 3,
      hours: 6,
      previewImage: null,
      approvalStatus: Number(id) % 3 === 0 ? 'ไม่อนุมัติ' : Number(id) % 2 === 0 ? 'รออนุมัติ' : 'อนุมัติ' as ApprovalStatus
    };
    
    setFormData({
      ...formData,
      ...mockEventData
    });
    
    setIsLoading(false);
  }
};

// ฟังก์ชันแปลง typeId เป็น eventType
const mapTypeIdToEventType = (typeId: string): EventType => {
  switch (typeId) {
    case "1":
      return "อบรม";
    case "2":
      return "อาสา";
    case "3":
      return "ช่วยงาน";
    default:
      return "อบรม";
  }
};

// ฟังก์ชันสำหรับส่งข้อมูลที่แก้ไขแล้วกลับไปยัง API
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // ตรวจสอบว่ามี id หรือไม่
  if (!id) {
    setApiError("ไม่พบรหัสกิจกรรมที่ต้องการแก้ไข");
    return;
  }
  
  // ตรวจสอบความถูกต้องของฟอร์ม
  if (!validateForm()) {
    return;
  }
  
  setIsSubmitting(true);
  setApiError(null);
  
  try {
    // ดึง token จาก localStorage
    const authData = localStorage.getItem("authData");
    if (!authData) {
      setApiError("ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่");
      setIsSubmitting(false);
      return;
    }

    // แปลงข้อมูล auth และดึง token
    const parsedAuthData = JSON.parse(authData);
    const token = parsedAuthData.token;
    
    if (!token) {
      setApiError("ไม่พบ token สำหรับการยืนยันตัวตน กรุณาเข้าสู่ระบบใหม่");
      setIsSubmitting(false);
      return;
    }

    // แปลงวันที่และเวลาให้อยู่ในรูปแบบ RFC 3339
    const startDateTime = formatDateToRFC3339(formData.startDate, formData.startTime);
    const endDateTime = formatDateToRFC3339(formData.endDate, formData.endTime);

    // สร้าง payload สำหรับการอัพเดทกิจกรรม
    const eventPayload = {
      title: formData.title,
      description: formData.description,
      typeId: mapEventTypeToTypeId(formData.eventType),
      location: formData.location,
      startTime: startDateTime,
      endTime: endDateTime,
      maxParticipants: formData.maxParticipants,
      imageUrl: "hi.png", // ใช้ค่าเริ่มต้นตามที่เห็นใน Swagger
    };

    console.log(`กำลังส่งคำขอแก้ไขกิจกรรมรหัส ${id} ไปยัง API`);
    console.log("ข้อมูลที่ส่ง:", eventPayload);
    console.log("ใช้ token:", token.substring(0, 15) + "...");

    // ส่งคำขอ PUT ไปยัง API โดยใส่ ID ในพาธ URL
    const response = await api.put(`/api/activities/${id}`, eventPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("การตอบกลับจาก API:", response.data);
    
    // แสดงข้อความแจ้งเตือนเมื่อแก้ไขสำเร็จ
    setSuccessMessage("แก้ไขกิจกรรมสำเร็จ!");
    
    // รอ 2 วินาทีแล้วนำทางกลับไปหน้ารายการกิจกรรม
    setTimeout(() => {
      navigate('/staff/activities');
    }, 2000);
  } catch (error: any) {
    console.error(`เกิดข้อผิดพลาดในการแก้ไขกิจกรรมรหัส ${id}:`, error);

    if (error.response) {
      console.error("สถานะ:", error.response.status);
      console.error("ข้อมูล:", error.response.data);

      // กำหนดข้อความแสดงข้อผิดพลาดตามการตอบกลับ
      if (error.response.status === 401) {
        setApiError("ไม่มีสิทธิ์ในการแก้ไขกิจกรรม หรือ token หมดอายุ กรุณาเข้าสู่ระบบใหม่");
      } else if (error.response.status === 404) {
        setApiError(`ไม่พบกิจกรรมรหัส ${id}`);
      } else {
        setApiError(error.response.data?.message || error.response.data?.error || "เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
      }
    } else {
      setApiError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  } finally {
    setIsSubmitting(false);
  }
};
  
  fetchEvent();
}, [id, navigate]);
  
 
  
  // ฟังก์ชันช่วยแปลงรูปแบบวันที่จาก ISO เป็น DD/MM/YYYY (พ.ศ.)
  const formatISOToThai = (isoDate: string): string => {
    if (!isoDate) return '';
    
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
    
    return `${day}/${month}/${year}`;
  };
  
  // ฟังก์ชันช่วยดึงเวลาจาก ISO
  const extractTimeFromISO = (isoDate: string): string => {
    if (!isoDate) return '00:00';
    
    const date = new Date(isoDate);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };
  
  // จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // ลบข้อผิดพลาดเมื่อผู้ใช้แก้ไขข้อมูล
    if (errors[name as keyof EventFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // จัดการการอัปโหลดรูปภาพ
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ตรวจสอบว่าเป็นไฟล์รูปภาพหรือไม่
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น'
        }));
        return;
      }
      
      // สร้าง URL สำหรับแสดงตัวอย่างรูปภาพ
      const imageUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        image: file,
        previewImage: imageUrl
      }));
      
      // ลบข้อผิดพลาดเมื่อผู้ใช้อัปโหลดรูปภาพ
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: undefined
        }));
      }
    }
  };
  
  // ตรวจสอบความถูกต้องของฟอร์ม
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};
    
    // ตรวจสอบชื่อกิจกรรม
    if (!formData.title.trim()) {
      newErrors.title = 'กรุณากรอกชื่อกิจกรรม';
    }
    
    // ตรวจสอบรายละเอียดกิจกรรม
    if (!formData.description.trim()) {
      newErrors.description = 'กรุณากรอกรายละเอียดกิจกรรม';
    }
    
    // ตรวจสอบวันที่เริ่มต้น
    if (!formData.startDate.trim()) {
      newErrors.startDate = 'กรุณาระบุวันที่เริ่มต้น';
    }
    
    // ตรวจสอบวันที่สิ้นสุด
    if (!formData.endDate.trim()) {
      newErrors.endDate = 'กรุณาระบุวันที่สิ้นสุด';
    }
    
    // ตรวจสอบความถูกต้องของวันที่ (วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด)
    if (formData.startDate && formData.endDate) {
      const [startDay, startMonth, startYear] = formData.startDate.split('/').map(Number);
      const [endDay, endMonth, endYear] = formData.endDate.split('/').map(Number);
      
      const startDateObj = new Date(startYear - 543, startMonth - 1, startDay);
      const endDateObj = new Date(endYear - 543, endMonth - 1, endDay);
      
      if (startDateObj > endDateObj) {
        newErrors.endDate = 'วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น';
      }
    }
    
    // ตรวจสอบสถานที่
    if (!formData.location.trim()) {
      newErrors.location = 'กรุณาระบุสถานที่จัดกิจกรรม';
    }
    
    // ตรวจสอบจำนวนรับสมัครสูงสุด
    if (formData.maxParticipants <= 0) {
      newErrors.maxParticipants = 'จำนวนรับสมัครต้องมากกว่า 0';
    }
    
    // ตรวจสอบคะแนนที่ได้รับ
    if (formData.score < 0) {
      newErrors.score = 'คะแนนต้องไม่น้อยกว่า 0';
    }
    
    // ตรวจสอบจำนวนชั่วโมง
    if (formData.hours <= 0) {
      newErrors.hours = 'จำนวนชั่วโมงต้องมากกว่า 0';
    }
    
    setErrors(newErrors);
    
    // ถ้าไม่มีข้อผิดพลาด (ค่าความยาวของ Object.keys(newErrors) เป็น 0) จะคืนค่า true
    return Object.keys(newErrors).length === 0;
  };

  // ฟังก์ชันสำหรับแปลงวันที่จาก DD/MM/YYYY เป็น RFC 3339
  const formatDateToRFC3339 = (dateString: string, timeString: string) => {
    // แยกวันที่และแปลงเป็นตัวเลข
    const [day, month, year] = dateString.split('/').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // แปลงปี พ.ศ. เป็น ค.ศ.
    const gregorianYear = year - 543;
    
    // สร้าง Date object (เดือนใน JavaScript เริ่มจาก 0)
    const date = new Date(gregorianYear, month - 1, day, hours, minutes);
    
    // สร้างรูปแบบ RFC 3339 (ISO 8601)
    return date.toISOString();
  };

  // จัดการการส่งฟอร์ม
  // ฟังก์ชันสำหรับส่งข้อมูลที่แก้ไขแล้วกลับไปยัง API
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // ตรวจสอบว่ามี id หรือไม่
  if (!id) {
    setApiError("ไม่พบรหัสกิจกรรมที่ต้องการแก้ไข");
    return;
  }
  
  // ตรวจสอบความถูกต้องของฟอร์ม
  if (!validateForm()) {
    return;
  }
  
  setIsSubmitting(true);
  setApiError(null);
  
  try {
    // ดึง token จาก localStorage
    const authData = localStorage.getItem("authData");
    if (!authData) {
      setApiError("ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่");
      setIsSubmitting(false);
      return;
    }

    // แปลงข้อมูล auth และดึง token
    const parsedAuthData = JSON.parse(authData);
    const token = parsedAuthData.token;
    
    if (!token) {
      setApiError("ไม่พบ token สำหรับการยืนยันตัวตน กรุณาเข้าสู่ระบบใหม่");
      setIsSubmitting(false);
      return;
    }

    // แปลงวันที่และเวลาให้อยู่ในรูปแบบ RFC 3339
    const startDateTime = formatDateToRFC3339(formData.startDate, formData.startTime);
    const endDateTime = formatDateToRFC3339(formData.endDate, formData.endTime);

    // สร้าง payload สำหรับการอัพเดทกิจกรรม
    const eventPayload = {
      title: formData.title,
      description: formData.description,
      typeId: mapEventTypeToTypeId(formData.eventType),
      location: formData.location,
      startTime: startDateTime,
      endTime: endDateTime,
      maxParticipants: formData.maxParticipants,
      imageUrl: "hi.png", // ใช้ค่าเริ่มต้นตามที่เห็นใน Swagger
    };

    console.log(`กำลังส่งคำขอแก้ไขกิจกรรมรหัส ${id} ไปยัง API`);
    console.log("ข้อมูลที่ส่ง:", eventPayload);
    console.log("ใช้ token:", token.substring(0, 15) + "...");

    // ส่งคำขอ PUT ไปยัง API โดยใส่ ID ในพาธ URL
    const response = await api.put(`/api/activities/${id}`, eventPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("การตอบกลับจาก API:", response.data);
    
    // แสดงข้อความแจ้งเตือนเมื่อแก้ไขสำเร็จ
    setSuccessMessage("แก้ไขกิจกรรมสำเร็จ!");
    
    // รอ 2 วินาทีแล้วนำทางกลับไปหน้ารายการกิจกรรม
    setTimeout(() => {
      navigate('/staff/activities');
    }, 2000);
  } catch (error: any) {
    console.error(`เกิดข้อผิดพลาดในการแก้ไขกิจกรรมรหัส ${id}:`, error);

    if (error.response) {
      console.error("สถานะ:", error.response.status);
      console.error("ข้อมูล:", error.response.data);

      // กำหนดข้อความแสดงข้อผิดพลาดตามการตอบกลับ
      if (error.response.status === 401) {
        setApiError("ไม่มีสิทธิ์ในการแก้ไขกิจกรรม หรือ token หมดอายุ กรุณาเข้าสู่ระบบใหม่");
      } else if (error.response.status === 404) {
        setApiError(`ไม่พบกิจกรรมรหัส ${id}`);
      } else {
        setApiError(error.response.data?.message || error.response.data?.error || "เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
      }
    } else {
      setApiError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  } finally {
    setIsSubmitting(false);
  }
};
  
  // ฟังก์ชันสำหรับการจัดรูปแบบวันที่ (DD/MM/YYYY)
  const formatDate = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // ลบตัวอักษรที่ไม่ใช่ตัวเลขและ /
    let formattedValue = value.replace(/[^\d/]/g, '');
    
    // จัดรูปแบบเป็น DD/MM/YYYY
    if (formattedValue.length > 0) {
      formattedValue = formattedValue
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
        .replace(/(\d{2})\/(\d{2})\/(\d{4}).+/, '$1/$2/$3');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };
  
  // ฟังก์ชันสำหรับการเลือกวันที่จากปฏิทิน
  const handleDatePickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // แปลงรูปแบบจาก YYYY-MM-DD เป็น DD/MM/YYYY
    if (value) {
      const [year, month, day] = value.split('-');
      const thaiYear = parseInt(year) + 543; // แปลงเป็น พ.ศ.
      const formattedDate = `${day}/${month}/${thaiYear}`;
      
      setFormData(prev => ({
        ...prev,
        [name === 'startDatePicker' ? 'startDate' : 'endDate']: formattedDate
      }));
    }
  };

  // กำหนดสีตามสถานะการอนุมัติ
  const getApprovalStatusColor = (status: ApprovalStatus): string => {
    switch (status) {
      case 'อนุมัติ':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'รออนุมัติ':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'ไม่อนุมัติ':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      default:
        return '';
    }
  };
  
  // แสดง loading ระหว่างโหลดข้อมูล
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/staff/activities')}
            className={`mr-4 p-2 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            แก้ไขกิจกรรม
          </h1>
        </div>
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
            {successMessage}
          </div>
        )}

        {apiError && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
            {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className={`p-6 rounded-lg shadow-md mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {/* รหัสกิจกรรม (แสดงเท่านั้น) */}
            <div className="mb-6">
              <label htmlFor="activityId" className="block text-sm font-medium mb-2">
                รหัสกิจกรรม
              </label>
              <input
                type="text"
                id="activityId"
                value={id || ''}
                disabled
                className={`w-full px-4 py-2 rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-400' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                } border cursor-not-allowed`}
              />
              <p className="mt-1 text-xs text-gray-500">รหัสกิจกรรมไม่สามารถแก้ไขได้</p>
            </div>
            
            {/* แสดงสถานะการอนุมัติ */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-sm font-medium">สถานะการอนุมัติ:</span>
                <span className={`ml-2 font-semibold ${getApprovalStatusColor(formData.approvalStatus)}`}>
                  {formData.approvalStatus}
                </span>
              </div>
            </div>
            
            {/* ชื่อกิจกรรม */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                ชื่อกิจกรรม
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } border ${errors.title ? 'border-red-500' : ''}`}
                placeholder="กรุณากรอกชื่อกิจกรรม"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            
            {/* ประเภทกิจกรรม */}
            <div className="mb-6">
              <label htmlFor="eventType" className="block text-sm font-medium mb-2">
                ประเภทกิจกรรม
              </label>
              <div className="relative">
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md appearance-none ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } border`}
                >
                  <option value="อบรม">อบรม</option>
                  <option value="อาสา">อาสา</option>
                  <option value="ช่วยงาน">ช่วยงาน</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* รายละเอียดกิจกรรม */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                รายละเอียดกิจกรรม
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } border ${errors.description ? 'border-red-500' : ''}`}
                placeholder="กรุณากรอกรายละเอียดกิจกรรม"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>
            
            {/* วันที่เริ่มต้น-วันที่สิ้นสุด */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* วันที่เริ่มต้น */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-2">
                  วันที่เริ่มต้น
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    onInput={(e) => formatDate(e as ChangeEvent<HTMLInputElement>)}
                    maxLength={10}
                    className={`w-full px-4 py-2 rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border ${errors.startDate ? 'border-red-500' : ''}`}
                    placeholder="DD/MM/YYYY"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <label htmlFor="startDatePicker" className="cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </label>
                    <input
                      type="date"
                      id="startDatePicker"
                      name="startDatePicker"
                      className="sr-only"
                      onChange={handleDatePickerChange}
                    />
                  </div>
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>
              
              {/* วันที่สิ้นสุด */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-2">
                  วันที่สิ้นสุด
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    onInput={(e) => formatDate(e as ChangeEvent<HTMLInputElement>)}
                    maxLength={10}
                    className={`w-full px-4 py-2 rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border ${errors.endDate ? 'border-red-500' : ''}`}
                    placeholder="DD/MM/YYYY"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <label htmlFor="endDatePicker" className="cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </label>
                    <input
                      type="date"
                      id="endDatePicker"
                      name="endDatePicker"
                      className="sr-only"
                      onChange={handleDatePickerChange}
                    />
                  </div>
                </div>
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* เวลาเริ่มต้น-เวลาสิ้นสุด */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* เวลาเริ่มต้น */}
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium mb-2">
                  เวลาเริ่มต้น
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } border`}
                />
              </div>

              {/* เวลาสิ้นสุด */}
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium mb-2">
                  เวลาสิ้นสุด
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } border`}
                />
              </div>
            </div>
            
            {/* สถานที่ */}
            <div className="mb-6">
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                สถานที่
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } border ${errors.location ? 'border-red-500' : ''}`}
                placeholder="กรุณากรอกสถานที่จัดกิจกรรม"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
              )}
            </div>
            
            {/* จำนวนรับสมัครสูงสุด */}
            <div className="mb-6">
              <label htmlFor="maxParticipants" className="block text-sm font-medium mb-2">
                จำนวนรับสมัครสูงสุด
              </label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2 rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } border ${errors.maxParticipants ? 'border-red-500' : ''}`}
                placeholder="กรุณากรอกจำนวนรับสมัครสูงสุด"
              />
              {errors.maxParticipants && (
                <p className="mt-1 text-sm text-red-500">{errors.maxParticipants}</p>
              )}
            </div>
            
            {/* จำนวนคะแนนและชั่วโมงที่ได้รับ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* จำนวนคะแนนที่ผู้เข้าร่วมจะได้รับ */}
              <div>
                <label htmlFor="score" className="block text-sm font-medium mb-2">
                  จำนวนคะแนนที่ผู้เข้าร่วมจะได้รับ
                </label>
                <input
                  type="number"
                  id="score"
                  name="score"
                  value={formData.score}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 rounded-md ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } border ${errors.score ? 'border-red-500' : ''}`}
                  placeholder="กรุณากรอกจำนวนคะแนน"
                />
                {errors.score && (
                  <p className="mt-1 text-sm text-red-500">{errors.score}</p>
                )}
              </div>
              
              {/* จำนวนชั่วโมงที่ผู้เข้าร่วมจะได้รับ */}
              <div>
                <label htmlFor="hours" className="block text-sm font-medium mb-2">
                  จำนวนชั่วโมงที่ผู้เข้าร่วมจะได้รับ
                </label>
                <input
                  type="number"
                  id="hours"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  min="0.5"
                  step="0.5"
                  className={`w-full px-4 py-2 rounded-md ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } border ${errors.hours ? 'border-red-500' : ''}`}
                  placeholder="กรุณากรอกจำนวนชั่วโมง"
                />
                {errors.hours && (
                  <p className="mt-1 text-sm text-red-500">{errors.hours}</p>
                )}
              </div>
            </div>
            
            {/* รูปกิจกรรม */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                รูปกิจกรรม
              </label>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                theme === 'dark' 
                  ? 'border-gray-600 hover:border-gray-500' 
                  : 'border-gray-300 hover:border-gray-400'
              } cursor-pointer transition-colors`}>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {formData.previewImage ? (
                  <div className="relative">
                    <img
                      src={formData.previewImage}
                      alt="ตัวอย่างรูปภาพ"
                      className="max-h-60 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: null, previewImage: null }))}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                      aria-label="ลบรูปภาพ"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label htmlFor="image" className="cursor-pointer block py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-1 text-sm">คลิกเพื่ออัปโหลดรูปภาพ</p>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF สูงสุด 10MB</p>
                  </label>
                )}
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-500">{errors.image}</p>
              )}
            </div>
            
            {/* สถานะการอนุมัติ - สำหรับแอดมินเท่านั้น */}
            {formData.approvalStatus !== 'อนุมัติ' && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                  หมายเหตุ: การแก้ไขกิจกรรมนี้อาจต้องได้รับการอนุมัติใหม่ การแก้ไขอาจทำให้สถานะการอนุมัติเปลี่ยนเป็น "รออนุมัติ"
                </p>
              </div>
            )}
          </div>
          
          {/* ปุ่มส่งฟอร์ม */}
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/staff/activities')}
              className={`px-6 py-3 rounded-md font-medium ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition-colors`}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-md font-medium ${
                isSubmitting 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังบันทึก...
                </span>
              ) : (
                'บันทึกการแก้ไข'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEventPage;