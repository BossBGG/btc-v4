import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../stores/theme.store';
import { CardContainer, CardBody, CardItem } from '../components/ui/3dCard';
import { mockEvents } from '../data/mockEvents';
import { EventCardProps } from '../components/EventCard';
import { useAuth } from '../hooks/UseAuth.hook';

// เพิ่มสถานะกิจกรรม
export type EventStatus = 'รออนุมัติ' | 'อนุมัติ' | 'ไม่อนุมัติ';

// ขยาย EventCardProps เพื่อรองรับสถานะการอนุมัติ
export interface EventWithApprovalProps extends EventCardProps {
  approvalStatus: EventStatus;
  createdBy?: string; // ID ของเจ้าหน้าที่ที่สร้างกิจกรรม
}

function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isAuthenticated, userRole, userId } = useAuth();
  
  const [event, setEvent] = useState<EventWithApprovalProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showApprovalConfirmDialog, setShowApprovalConfirmDialog] = useState(false);
  const [showRejectConfirmDialog, setShowRejectConfirmDialog] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

  // โหลดข้อมูลกิจกรรม
  useEffect(() => {
    if (id) {
      // จำลองการเพิ่มข้อมูลสถานะการอนุมัติและผู้สร้างกิจกรรม
      // ในการใช้งานจริงควรดึงข้อมูลจาก API
      const foundEvent = mockEvents.find(e => e.id.toString() === id);
      
      if (foundEvent) {
        // จำลองข้อมูลเพิ่มเติม (ในงานจริงควรมีใน API)
        const eventWithStatus: EventWithApprovalProps = {
          ...foundEvent,
          // สมมติข้อมูลสถานะการอนุมัติ (จำลองเพื่อทดสอบ)
          approvalStatus: id === '1' ? 'อนุมัติ' : id === '2' ? 'รออนุมัติ' : id === '3' ? 'ไม่อนุมัติ' : 'อนุมัติ',
          // สมมติว่ากิจกรรมที่ ID เป็น 1, 2, 3 สร้างโดยผู้ใช้ปัจจุบัน (เพื่อทดสอบ)
          createdBy: id === '1' || id === '2' || id === '3' ? userId : 'other-staff-id'
        };
        
        setEvent(eventWithStatus);
        
        // ตรวจสอบว่าผู้ใช้สมัครแล้วหรือยัง (จำลองจาก localStorage)
        const registeredEvents = localStorage.getItem('registeredEvents');
        if (registeredEvents) {
          const eventIds = JSON.parse(registeredEvents) as string[];
          setIsRegistered(eventIds.includes(id));
        }
      }
      
      setLoading(false);
    }
  }, [id, userId]);

  // ฟังก์ชันจัดการการสมัครกิจกรรม
  const handleRegister = () => {
    if (!isAuthenticated) {
      // ถ้ายังไม่ได้ล็อกอิน ให้ redirect ไปหน้า login
      navigate('/login', { state: { from: `/events/detail/${id}` } });
      return;
    }
    
    setShowConfirmDialog(true);
  };

  // ฟังก์ชันยืนยันการสมัครกิจกรรม
  const confirmRegistration = () => {
    // บันทึกข้อมูลการสมัครลงใน localStorage
    const registeredEvents = localStorage.getItem('registeredEvents');
    let eventIds: string[] = [];
    
    if (registeredEvents) {
      eventIds = JSON.parse(registeredEvents);
    }
    
    if (!eventIds.includes(id!)) {
      eventIds.push(id!);
      localStorage.setItem('registeredEvents', JSON.stringify(eventIds));
    }
    
    setIsRegistered(true);
    setShowConfirmDialog(false);
  };

  // ฟังก์ชันยกเลิกการแสดง dialog
  const cancelRegistration = () => {
    setShowConfirmDialog(false);
  };

  // ฟังก์ชันจัดการการอนุมัติกิจกรรม
  const handleApprove = () => {
    setApprovalAction('approve');
    setShowApprovalConfirmDialog(true);
  };

  // ฟังก์ชันจัดการการปฏิเสธกิจกรรม
  const handleReject = () => {
    setApprovalAction('reject');
    setShowRejectConfirmDialog(true);
  };

  // ฟังก์ชันยืนยันการอนุมัติหรือปฏิเสธกิจกรรม
  const confirmApprovalAction = () => {
    if (event && id) {
      if (approvalAction === 'approve') {
        // จำลองการเปลี่ยนสถานะการอนุมัติ (ในงานจริงควรใช้ API)
        setEvent({
          ...event,
          approvalStatus: 'อนุมัติ'
        });
        setShowApprovalConfirmDialog(false);
      } else if (approvalAction === 'reject') {
        // จำลองการเปลี่ยนสถานะการปฏิเสธ (ในงานจริงควรใช้ API)
        setEvent({
          ...event,
          approvalStatus: 'ไม่อนุมัติ'
        });
        setShowRejectConfirmDialog(false);
      }
    }
  };

  // ฟังก์ชันยกเลิก dialog การอนุมัติหรือปฏิเสธ
  const cancelApprovalAction = () => {
    if (approvalAction === 'approve') {
      setShowApprovalConfirmDialog(false);
    } else if (approvalAction === 'reject') {
      setShowRejectConfirmDialog(false);
    }
    setApprovalAction(null);
  };

  // ตรวจสอบว่าเป็นผู้สร้างกิจกรรมนี้หรือไม่
  const isEventCreator = (): boolean => {
    return (
      userRole === 'staff' && 
      event?.createdBy === userId
    );
  };

  // ตรวจสอบว่าเป็น admin หรือไม่
  const isAdmin = (): boolean => {
    return userRole === 'admin';
  };

  // ตรวจสอบว่าสามารถแสดงปุ่มสมัครหรือไม่
  const canShowRegisterButton = (): boolean => {
    // ถ้าเป็น staff ที่สร้างกิจกรรมนี้ ไม่แสดงปุ่มสมัคร
    if (isEventCreator()) {
      return false;
    }
    
    // ถ้ากิจกรรมยังไม่ได้รับการอนุมัติ และผู้ใช้ไม่ใช่ staff หรือ admin ไม่แสดงปุ่มสมัคร
    if (
      event?.approvalStatus !== 'อนุมัติ' && 
      userRole !== 'staff' && 
      userRole !== 'admin'
    ) {
      return false;
    }
    
    return true;
  };

  // ตรวจสอบว่าสามารถแสดงปุ่มอนุมัติ/ปฏิเสธหรือไม่
  const canShowApprovalButtons = (): boolean => {
    // แสดงปุ่มอนุมัติ/ปฏิเสธเฉพาะ admin และสถานะของกิจกรรมเป็น "รออนุมัติ"
    return isAdmin() && event?.approvalStatus === 'รออนุมัติ';
  };

  // กำหนดสีตามประเภทกิจกรรม
  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case 'อบรม':
        return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'อาสา':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'ช่วยงาน':
        return theme === 'dark' ? 'text-purple-400' : 'text-purple-600';
      default:
        return '';
    }
  };

  // กำหนดสีตามสถานะการอนุมัติ
  const getApprovalStatusColor = (status: EventStatus): string => {
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

  // ถ้ากำลังโหลด ให้แสดง loading
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ถ้าไม่พบกิจกรรม
  if (!event) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <h1 className="text-2xl font-bold mb-4">ไม่พบกิจกรรมที่ต้องการ</h1>
        <button
          onClick={() => navigate('/')}
          className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          กลับไปหน้าหลัก
        </button>
      </div>
    );
  }

  // ถ้าผู้ใช้ทั่วไปพยายามเข้าถึงกิจกรรมที่ยังไม่ได้รับการอนุมัติ
  if (
    event.approvalStatus !== 'อนุมัติ' && 
    userRole !== 'staff' && 
    userRole !== 'admin'
  ) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <h1 className="text-2xl font-bold mb-4">กิจกรรมนี้ยังไม่เปิดให้เข้าถึง</h1>
        <p className="mb-4 text-center">กิจกรรมนี้ยังอยู่ในระหว่างการพิจารณาหรือไม่ได้รับการอนุมัติ</p>
        <button
          onClick={() => navigate('/')}
          className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          กลับไปหน้าหลัก
        </button>
      </div>
    );
  }

  // ถ้าเป็น staff แต่ไม่ใช่ผู้สร้างกิจกรรมนี้และกิจกรรมยังไม่ได้รับการอนุมัติ
  if (
    userRole === 'staff' && 
    event.approvalStatus !== 'อนุมัติ' && 
    event.createdBy !== userId
  ) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <h1 className="text-2xl font-bold mb-4">ไม่มีสิทธิ์เข้าถึงกิจกรรมนี้</h1>
        <p className="mb-4 text-center">กิจกรรมนี้ยังไม่ได้รับการอนุมัติและคุณไม่ใช่ผู้สร้างกิจกรรมนี้</p>
        <button
          onClick={() => navigate('/')}
          className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          กลับไปหน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto py-8 px-4">
        {/* ชื่อกิจกรรม */}
        <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {event.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* คอลัมน์ซ้าย - แสดงการ์ด 3D */}
          <div>
            <CardContainer className="py-0">
              <CardBody className={`relative w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl border border-gray-200 shadow-xl p-6`}>
                {/* รูปภาพกิจกรรม */}
                <CardItem translateZ="100" className="w-full">
                  <img
                    src={event.image || "/api/placeholder/600/400"}
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                </CardItem>

                {/* ข้อมูลผู้จัด */}
                <CardItem translateZ="50" className="w-full mt-2">
                  <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span className="font-medium">ผู้จัด : {event.organizer}</span>
                  </div>
                </CardItem>

                {/* สถานะการอนุมัติ */}
                <CardItem translateZ="50" className="w-full mt-4">
                  <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center mb-2">
                      <span className="font-medium mr-2">สถานะ :</span>
                      <span className={`font-medium ${getApprovalStatusColor(event.approvalStatus)}`}>
                        {event.approvalStatus}
                      </span>
                    </div>
                  </div>
                </CardItem>

                {/*
                //แสดงข้อมูลเพิ่มเติมสำหรับผู้สร้างกิจกรรม 
                {isEventCreator() && (
                  <CardItem translateZ="50" className="w-full mt-4">
                    <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center mb-2">
                        <span className="font-medium mr-2">สถานะผู้ใช้ :</span>
                        <span className="font-medium text-blue-600">ผู้สร้างกิจกรรมนี้</span>
                      </div>
                    </div>
                  </CardItem>
                )}
                */}

              </CardBody>
            </CardContainer>
          </div>

          {/* คอลัมน์ขวา - รายละเอียดกิจกรรม */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl border border-gray-200 shadow-md`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              รายละเอียด
            </h2>
            
            <div className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>{event.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* ประเภท */}
              <div>
                <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  ประเภท
                </h3>
                <p className={`font-medium ${getEventTypeColor(event.eventType)}`}>
                  {event.eventType}
                </p>
              </div>
              
              {/* ระยะเวลา */}
              <div>
                <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  ระยะเวลา
                </h3>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {event.startDate} - {event.endDate}
                </p>
              </div>
              
              {/* จำนวนรับสมัคร */}
              <div>
                <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  จำนวนรับสมัคร
                </h3>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  0 / {event.maxParticipants} คน
                </p>
              </div>
              
              {/* จำนวนคะแนนที่ได้รับ */}
              <div>
                <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  จำนวนคะแนนที่ได้รับ
                </h3>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {event.score} คะแนน
                </p>
              </div>
              
              {/* จำนวนชั่วโมงที่ได้รับ */}
              <div>
                <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  จำนวนชั่วโมงที่ได้รับ
                </h3>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {event.hours} ชั่วโมง
                </p>
              </div>
              
              {/* สถานที่ */}
              <div>
                <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  สถานที่
                </h3>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {event.location}
                </p>
              </div>
            </div>

            {/* ปุ่มสมัครกิจกรรม - แสดงเฉพาะเมื่อมีเงื่อนไขที่เหมาะสม */}
            {canShowRegisterButton() && !isAdmin && (
              <div className="mt-2">
                {isRegistered ? (
                  <button 
                    disabled
                    className="w-full py-2 px-4 bg-gray-500 text-white font-medium rounded-md cursor-not-allowed"
                  >
                    สมัครแล้ว
                  </button>
                ) : (
                  <button 
                    onClick={handleRegister}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    สมัครกิจกรรม
                  </button>
                )}
              </div>
            )}
            
            {/* แสดงข้อความสำหรับผู้สร้างกิจกรรม */}
            {isEventCreator() && (
              <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-md">
                <p className={`text-sm text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                  คุณเป็นผู้สร้างกิจกรรมนี้ 
                </p>
              </div>
            )}
            
            {/* ปุ่มอนุมัติ/ปฏิเสธกิจกรรม - แสดงเฉพาะสำหรับ admin และกิจกรรมที่รออนุมัติ */}
            {canShowApprovalButtons() && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={handleReject}
                  className={`py-2 px-4 font-medium rounded-md ${
                    theme === 'dark' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  ปฏิเสธกิจกรรม
                </button>
                <button
                  onClick={handleApprove}
                  className={`py-2 px-4 font-medium rounded-md ${
                    theme === 'dark' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  อนุมัติกิจกรรม
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog สำหรับการสมัครกิจกรรม */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              ยืนยันการสมัครกิจกรรม
            </h2>
            <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {event.title}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelRegistration}
                className={`flex-1 py-2 px-4 rounded-md border ${
                  theme === 'dark' 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmRegistration}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog สำหรับการอนุมัติกิจกรรม */}
      {showApprovalConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              ยืนยันการอนุมัติกิจกรรม
            </h2>
            <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {event.title}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelApprovalAction}
                className={`flex-1 py-2 px-4 rounded-md border ${
                  theme === 'dark' 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmApprovalAction}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog สำหรับการปฏิเสธกิจกรรม */}
      {showRejectConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              ยืนยันการปฏิเสธกิจกรรม
            </h2>
            <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {event.title}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelApprovalAction}
                className={`flex-1 py-2 px-4 rounded-md border ${
                  theme === 'dark' 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmApprovalAction}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetailPage;