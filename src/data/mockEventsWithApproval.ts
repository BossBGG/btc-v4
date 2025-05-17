import { EventCardProps } from '../components/EventCard';
import { EventStatus } from '../pages/EventDetailPage';

// ข้อมูลตัวอย่างของกิจกรรม (Mock Data) พร้อมด้วยสถานะการอนุมัติ
export interface EventWithApprovalProps extends EventCardProps {
  approvalStatus: EventStatus;
  createdBy: string; // ID ของเจ้าหน้าที่ที่สร้างกิจกรรม
}

export const mockEventsWithApproval: EventWithApprovalProps[] = [
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
    approvalStatus: 'อนุมัติ',
    createdBy: 'staff-1'
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
    approvalStatus: 'รออนุมัติ',
    createdBy: 'staff-1'
  },
  {
    id: '3',
    title: 'งานวิ่งการกุศล Run for Wildlife',
    description: 'ช่วยงานจัดการแข่งขันวิ่งการกุศลเพื่อระดมทุนช่วยเหลือสัตว์ป่าที่ใกล้สูญพันธุ์ในประเทศไทย ผู้เข้าร่วมได้รับประสบการณ์ในการจัดงานขนาดใหญ่',
    eventType: 'ช่วยงาน',
    image: '/uxui.png',
    organizer: 'สโมสรนิสิต',
    startDate: '30 พ.ค. 2566',
    endDate: '30 พ.ค. 2566',
    maxParticipants: 20,
    score: 3,
    hours: 5,
    location: 'สวนสาธารณะสวนหลวง ร.9',
    approvalStatus: 'ไม่อนุมัติ',
    createdBy: 'staff-1'
  },
  {
    id: '4',
    title: 'อบรมปฐมพยาบาลเบื้องต้นและการช่วยชีวิต',
    description: 'เรียนรู้วิธีการปฐมพยาบาลเบื้องต้นในสถานการณ์ฉุกเฉิน การช่วยฟื้นคืนชีพ (CPR) และการใช้เครื่อง AED โดยวิทยากรผู้เชี่ยวชาญ',
    eventType: 'อบรม',
    image: '/uxui.png',
    organizer: 'คณะพยาบาลศาสตร์',
    startDate: '5 มิ.ย. 2566',
    endDate: '5 มิ.ย. 2566',
    maxParticipants: 40,
    score: 3,
    hours: 6,
    location: 'ห้องประชุมคณะพยาบาลศาสตร์',
    approvalStatus: 'อนุมัติ',
    createdBy: 'staff-2'
  },
  {
    id: '5',
    title: 'ค่ายอาสาพัฒนาโรงเรียน',
    description: 'ร่วมกันสร้างห้องสมุดและปรับปรุงสนามเด็กเล่นให้กับโรงเรียนในถิ่นทุรกันดาร พร้อมจัดกิจกรรมส่งเสริมการอ่านและกีฬาให้เด็กนักเรียน',
    eventType: 'อาสา',
    image: '/uxui.png',
    organizer: 'ชมรมค่ายอาสา',
    startDate: '10 มิ.ย. 2566',
    endDate: '13 มิ.ย. 2566',
    maxParticipants: 25,
    score: 10,
    hours: 32,
    location: 'โรงเรียนบ้านห้วยกระทิง จ.ตาก',
    approvalStatus: 'อนุมัติ',
    createdBy: 'staff-2'
  },
  {
    id: '6',
    title: 'อบรมทักษะการนำเสนอและการพูดในที่สาธารณะ',
    description: 'พัฒนาทักษะการนำเสนองานอย่างมืออาชีพและเทคนิคการพูดในที่สาธารณะ เพิ่มความมั่นใจในการสื่อสาร',
    eventType: 'อบรม',
    image: '/uxui.png',
    organizer: 'ชมรมพัฒนาศักยภาพนิสิต',
    startDate: '18 มิ.ย. 2566',
    endDate: '19 มิ.ย. 2566',
    maxParticipants: 35,
    score: 2,
    hours: 8,
    location: 'ห้องประชุมคณะมนุษยศาสตร์',
    approvalStatus: 'รออนุมัติ',
    createdBy: 'staff-3'
  },
  {
    id: '7',
    title: 'งานบริจาคโลหิตเพื่อช่วยเหลือผู้ป่วย',
    description: 'ช่วยงานรับบริจาคโลหิต ซึ่งจะนำไปช่วยเหลือผู้ป่วยในโรงพยาบาลที่ขาดแคลน',
    eventType: 'ช่วยงาน',
    image: '/uxui.png',
    organizer: 'สภากาชาดไทย',
    startDate: '25 มิ.ย. 2566',
    endDate: '25 มิ.ย. 2566',
    maxParticipants: 15,
    score: 2,
    hours: 4,
    location: 'หอประชุมมหาวิทยาลัย',
    approvalStatus: 'อนุมัติ',
    createdBy: 'staff-3'
  }
];

/**
 * ฟังก์ชันกรองกิจกรรมตามสิทธิ์การเข้าถึง (สำหรับ Home, Search, EventType)
 * 
 * @param events รายการกิจกรรมทั้งหมด
 * @param userRole บทบาทของผู้ใช้ (student, staff, admin)
 * @param userId ID ของผู้ใช้ (สำหรับกรณี staff ที่จะเห็นกิจกรรมของตัวเองทั้งหมด)
 * @returns รายการกิจกรรมที่กรองตามสิทธิ์แล้ว
 */
export const filterEventsByPermission = (
  events: EventWithApprovalProps[],
  userRole: string | null,
  userId: string | null
): EventWithApprovalProps[] => {
  // กรณีเป็น admin จะเห็นทุกกิจกรรม
  if (userRole === 'admin') {
    return events;
  }
  
  // กรณีเป็น staff จะเห็นกิจกรรมที่อนุมัติแล้วทั้งหมด + กิจกรรมที่ตัวเองสร้าง
  if (userRole === 'staff') {
    return events.filter(event => 
      event.approvalStatus === 'อนุมัติ' || event.createdBy === userId
    );
  }
  
  // กรณีเป็น student หรือไม่ได้ล็อกอิน จะเห็นเฉพาะกิจกรรมที่อนุมัติแล้ว
  return events.filter(event => event.approvalStatus === 'อนุมัติ');
};

// แยกกิจกรรมตามประเภท (เพื่อความสะดวกในการเรียกใช้)
export const getEventsByType = (userRole: string | null, userId: string | null) => {
  // กรองกิจกรรมตามสิทธิ์ก่อน
  const filteredEvents = filterEventsByPermission(mockEventsWithApproval, userRole, userId);
  
  // แยกตามประเภท
  return {
    trainingEvents: filteredEvents.filter(event => event.eventType === 'อบรม'),
    volunteerEvents: filteredEvents.filter(event => event.eventType === 'อาสา'),
    helperEvents: filteredEvents.filter(event => event.eventType === 'ช่วยงาน')
  };
};

// ฟังก์ชันค้นหากิจกรรม (ปรับปรุงให้คำนึงถึงสิทธิ์การเข้าถึง)
export const searchEvents = (
  query: string, 
  filters: {training: boolean, volunteer: boolean, helper: boolean},
  userRole: string | null,
  userId: string | null
) => {
  // กรองกิจกรรมตามสิทธิ์ก่อน
  const filteredEvents = filterEventsByPermission(mockEventsWithApproval, userRole, userId);
  
  // ถ้าไม่มีการเลือกฟิลเตอร์ใดๆ ให้แสดงทุกประเภท
  if (!filters.training && !filters.volunteer && !filters.helper) {
    return filteredEvents.filter(event => 
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.organizer.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // กรองตามประเภทที่เลือก
  return filteredEvents.filter(event => {
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