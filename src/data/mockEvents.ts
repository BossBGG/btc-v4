import { EventCardProps } from '../components/EventCard';
import api from '../services/api';

// สร้างข้อมูลเริ่มต้นจำลองสำหรับ mockEvents
let mockEvents: EventCardProps[] = [];

// ฟังก์ชันสำหรับดึงข้อมูลและแปลงข้อมูลจาก API
export const fetchEvents = async () => {
  try {
    const user = localStorage.getItem('authData');
    const token = user ? JSON.parse(user).token : null;

    const response = await api.get('activities/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('API response:', response.data);
    
    if (response.data && response.data.activities) {
      // แปลงข้อมูลจาก API เป็นรูปแบบที่เราต้องการ
      mockEvents = response.data.activities.map((event: any) => {
        // ตรวจสอบวันที่ที่อาจมีปัญหา
        const startTime = event.startTime || new Date().toISOString();
        const endTime = (event.endTime && event.endTime.startsWith('+')) 
          ? startTime // ถ้าวันที่มีปัญหาให้ใช้ startTime แทน
          : event.endTime || startTime;
          
        return {
          id: event.id,
          title: event.title,
          description: event.description || '',
          eventType: event.type?.name || 'อื่นๆ',
          image: event.imageUrl || '/uxui.png',
          organizer: event.createdBy?.name || '',
          startDate: new Date(startTime).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          endDate: new Date(endTime).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          maxParticipants: event.maxParticipants || 0,
          score: event.score || 0,
          hours: (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60 * 60) || 0,
          location: event.location || '',
        };
      });
      
      console.log('Formatted events:', mockEvents);
      return mockEvents;
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    
    // ถ้าการดึงข้อมูลจาก API ผิดพลาด ให้ใช้ข้อมูลจำลองแทน
    mockEvents = getStaticMockEvents();
    return mockEvents;
  }

  // ถ้าไม่สามารถดึงข้อมูลได้ ให้ใช้ข้อมูลจำลองแทน
  mockEvents = getStaticMockEvents();
  return mockEvents;
};

// เรียกใช้เมื่อโหลดไฟล์ เพื่อดึงข้อมูลจาก API
fetchEvents();

// แยกกิจกรรมตามประเภท (เพื่อความสะดวกในการเรียกใช้)
export const getEventsByType = () => {
  return {
    trainingEvents: mockEvents.filter(event => event.eventType === 'อบรม'),
    volunteerEvents: mockEvents.filter(event => event.eventType === 'อาสา'),
    helperEvents: mockEvents.filter(event => event.eventType === 'ช่วยงาน')
  };
};

// ฟังก์ชันค้นหากิจกรรม
export const searchEvents = (
  query: string, 
  filters: {training: boolean, volunteer: boolean, helper: boolean}
) => {
  // ถ้าไม่มีการเลือกฟิลเตอร์ใดๆ ให้แสดงทุกประเภท
  if (!filters.training && !filters.volunteer && !filters.helper) {
    return mockEvents.filter(event => 
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.organizer.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // กรองตามประเภทที่เลือก
  return mockEvents.filter(event => {
    // ตรวจสอบคำค้นหา
    const matchQuery = 
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.organizer.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase());
    
    // ตรวจสอบว่าตรงกับฟิลเตอร์ที่เลือกหรือไม่
    const matchType = 
      (filters.training && event.eventType === 'อบรม') ||
      (filters.volunteer && event.eventType === 'อาสา') ||
      (filters.helper && event.eventType === 'ช่วยงาน');
    
    return matchQuery && matchType;
  });
};

// ฟังก์ชันสำหรับสร้างข้อมูลจำลองในกรณีที่ไม่สามารถเรียกข้อมูลจาก API ได้
function getStaticMockEvents(): EventCardProps[] {
  return [
    {
      id: '1',
      title: 'อบรมการเขียนโปรแกรม Python สำหรับผู้เริ่มต้น',
      description: 'เรียนรู้การเขียนโปรแกรมด้วยภาษา Python ตั้งแต่พื้นฐานจนถึงขั้นสูง เหมาะสำหรับผู้เริ่มต้นที่ไม่มีประสบการณ์การเขียนโค้ดมาก่อน',
      eventType: 'อบรม',
      image: '/uxui.png',
      organizer: 'ชมรมคอมพิวเตอร์',
      startDate: '15 พ.ค. 2566',
      endDate: '16 พ.ค. 2566',
      maxParticipants: 30,
      score: 2,
      hours: 6,
      location: 'ห้องปฏิบัติการคอมพิวเตอร์ อาคาร IT',
    },
    {
      id: '2',
      title: 'ปลูกป่าชายเลนเพื่อโลกสีเขียว',
      description: 'ร่วมกันปลูกป่าชายเลนเพื่อรักษาระบบนิเวศชายฝั่งและลดการกัดเซาะชายฝั่ง พร้อมเรียนรู้ความสำคัญของระบบนิเวศป่าชายเลน',
      eventType: 'อาสา',
      image: '/uxui.png',
      organizer: 'ชมรมอนุรักษ์สิ่งแวดล้อม',
      startDate: '22 พ.ค. 2566',
      endDate: '22 พ.ค. 2566',
      maxParticipants: 50,
      score: 5,
      hours: 8,
      location: 'ป่าชายเลนบางปู จ.สมุทรปราการ',
    },
    {
      id: '3',
      title: 'ช่วยงานจัดเตรียมงานรับปริญญา',
      description: 'ขอเชิญนักศึกษาร่วมเป็นส่วนหนึ่งในการช่วยจัดเตรียมสถานที่และอำนวยความสะดวกสำหรับงานรับปริญญาประจำปี 2566',
      eventType: 'ช่วยงาน',
      image: '/uxui.png',
      organizer: 'ฝ่ายกิจการนักศึกษา',
      startDate: '1 มิ.ย. 2566',
      endDate: '5 มิ.ย. 2566',
      maxParticipants: 100,
      score: 4,
      hours: 20,
      location: 'หอประชุมกิจกรรมนักศึกษา',
    }
  ];
}

export { mockEvents };