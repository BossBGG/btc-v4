import { EventCardProps } from '../components/EventCard';

// ข้อมูลตัวอย่างของกิจกรรม (Mock Data)
export const mockEvents: EventCardProps[] = [
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
  },
  {
    id: '8',
    title: 'โครงการสอนน้อง ปันความรู้สู่ชุมชน',
    description: 'ร่วมเป็นอาสาสมัครสอนวิชาคณิตศาสตร์และวิทยาศาสตร์ให้กับเด็กนักเรียนในชุมชนที่ขาดแคลนโอกาสทางการศึกษา',
    eventType: 'อาสา',
    image: '/uxui.png',
    organizer: 'ชมรมจิตอาสา',
    startDate: '1 ก.ค. 2566',
    endDate: '31 ก.ค. 2566',
    maxParticipants: 20,
    score: 8,
    hours: 24,
    location: 'โรงเรียนในชุมชนรอบมหาวิทยาลัย',
  },
  {
    id: '9',
    title: 'อบรมการประกอบคอมพิวเตอร์และการแก้ไขปัญหาเบื้องต้น',
    description: 'เรียนรู้วิธีการประกอบคอมพิวเตอร์ด้วยตนเอง เลือกซื้ออุปกรณ์ให้เหมาะสม และการแก้ไขปัญหาที่พบบ่อย',
    eventType: 'อบรม',
    image: '/uxui.png',
    organizer: 'ชมรมคอมพิวเตอร์',
    startDate: '2 ก.ค. 2566',
    endDate: '3 ก.ค. 2566',
    maxParticipants: 30,
    score: 2,
    hours: 6,
    location: 'ห้องปฏิบัติการคอมพิวเตอร์ อาคาร IT',
  },
  {
    id: '10',
    title: 'ปลูกต้นไม้ริมคลอง',
    description: 'ร่วมกันปลูกต้นไม้ริมคลองเพื่อเพิ่มพื้นที่สีเขียวและป้องกันการพังทลายของตลิ่ง',
    eventType: 'อาสา',
    image: '/uxui.png',
    organizer: 'ชมรมอนุรักษ์สิ่งแวดล้อม',
    startDate: '5 มิ.ย. 2566',
    endDate: '5 มิ.ย. 2566',
    location: 'คลองแสนแสบ',
    maxParticipants: 50,
    score: 5,
    hours: 8,
  },
  {
    id: '11',
    title: 'ค่ายอาสาสร้างฝายชะลอน้ำ',
    description: 'ร่วมสร้างฝายชะลอน้ำเพื่อรักษาความชุ่มชื้นให้ผืนป่าและแก้ปัญหาภัยแล้ง',
    eventType: 'อาสา',
    image: '/uxui.png',
    organizer: 'ชมรมค่ายอาสา',
    startDate: '20 มิ.ย. 2566',
    endDate: '23 มิ.ย. 2566',
    location: 'อุทยานแห่งชาติดอยอินทนนท์ จ.เชียงใหม่',
    maxParticipants: 25,
    score: 10,
    hours: 32,
  },
  {
    id: '12',
    title: 'อาสาเลี้ยงอาหารผู้สูงอายุ',
    description: 'ร่วมเลี้ยงอาหารกลางวันและทำกิจกรรมสันทนาการให้กับผู้สูงอายุในสถานสงเคราะห์',
    eventType: 'อาสา',
    image: '/uxui.png',
    organizer: 'ชมรมจิตอาสา',
    startDate: '12 ก.ค. 2566',
    endDate: '12 ก.ค. 2566',
    location: 'สถานสงเคราะห์คนชรา',
    maxParticipants: 20,
    score: 3,
    hours: 5,
  },
  
];

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