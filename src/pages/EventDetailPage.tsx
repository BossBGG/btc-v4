import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../stores/theme.store';
import { useAuth } from '../hooks/UseAuth.hook';
import LoadingPage from './LoadingPage';
import api from '../services/api';

interface ActivityDetail {
  id: number | string;
  title: string;
  description: string;
  type: {
    id: number;
    name: string;
  };
  location: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  createdBy: {
    id: number | string;
    name: string;
  };
  status: string;
  imageUrl: string;
  // สามารถเพิ่ม properties อื่นๆ ที่จำเป็นได้
}

function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');

  // ดึงข้อมูลกิจกรรมเมื่อโหลดหน้า
  useEffect(() => {
    const fetchActivityDetail = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // ดึง token จาก localStorage
        const authData = localStorage.getItem('authData');
        const token = authData ? JSON.parse(authData).token : '';
        
        // เรียกใช้ API เพื่อดึงข้อมูลกิจกรรมตาม ID
        const response = await api.get(`/api/activities/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setActivity(response.data);
        
        // ตรวจสอบว่าผู้ใช้ลงทะเบียนแล้วหรือไม่ (สมมติให้มี API endpoint สำหรับตรวจสอบ)
        if (isAuthenticated && token) {
          try {
            const registrationResponse = await api.get(`/api/activities/${id}/registration-status`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            setIsRegistered(registrationResponse.data.isRegistered);
          } catch (err) {
            console.error('ไม่สามารถตรวจสอบสถานะการลงทะเบียนได้:', err);
            // ไม่แสดงข้อผิดพลาดนี้แก่ผู้ใช้ เนื่องจากไม่ใช่ข้อผิดพลาดหลัก
          }
        }
        
      } catch (err: any) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม:', err);
        
        if (err.response?.status === 404) {
          setError('ไม่พบกิจกรรมที่ต้องการ');
        } else {
          setError('เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม โปรดลองใหม่อีกครั้ง');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivityDetail();
  }, [id, isAuthenticated]);

  // ฟังก์ชันสำหรับการลงทะเบียนเข้าร่วมกิจกรรม
  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/detail/${id}` } });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // ดึง token จาก localStorage
      const authData = localStorage.getItem('authData');
      const token = authData ? JSON.parse(authData).token : '';
      
      if (!token) {
        setError('กรุณาเข้าสู่ระบบก่อนลงทะเบียนเข้าร่วมกิจกรรม');
        return;
      }
      
      // เรียกใช้ API สำหรับลงทะเบียนเข้าร่วมกิจกรรม
      const response = await api.post(`/api/activities/${id}/register`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setIsRegistered(true);
      setRegistrationMessage('ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ!');
      
      // อัพเดตจำนวนผู้เข้าร่วม
      if (activity) {
        setActivity({
          ...activity,
          currentParticipants: activity.currentParticipants + 1
        });
      }
      
    } catch (err: any) {
      console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองใหม่อีกครั้ง');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันแปลงรูปแบบวันที่และเวลา
  const formatDateTime = (dateTimeString: string): string => {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    
    // แปลงเป็นรูปแบบวันที่ไทย (วัน/เดือน/ปี)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
    
    // แปลงเป็นเวลา
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes} น.`;
  };

  // ฟังก์ชันแปลงรูปแบบสถานะให้แสดงสีที่เหมาะสม
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'รับสมัคร':
        return theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800';
      case 'กำลังดำเนินการ':
        return theme === 'dark' ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800';
      case 'เสร็จสิ้น':
        return theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800';
      case 'ยกเลิก':
        return theme === 'dark' ? 'bg-red-700 text-white' : 'bg-red-100 text-red-800';
      default:
        return theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800';
    }
  };

  // ฟังก์ชันแปลงรูปแบบประเภทให้แสดงสีที่เหมาะสม
  const getTypeColor = (typeId: number) => {
    switch (typeId) {
      case 1: // อบรม
        return 'bg-blue-600 text-white';
      case 2: // อาสา
        return 'bg-green-600 text-white';
      case 3: // ช่วยงาน
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  // แสดง LoadingPage ระหว่างโหลดข้อมูล
  if (isLoading) {
    return <LoadingPage />;
  }

  // แสดงข้อความกรณีไม่พบกิจกรรม
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className={`max-w-md p-8 rounded-lg shadow-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold mb-4">{error}</h2>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            กลับสู่หน้ากิจกรรม
          </button>
        </div>
      </div>
    );
  }

  // แสดงข้อความกรณีไม่มีข้อมูลกิจกรรม
  if (!activity) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className={`max-w-md p-8 rounded-lg shadow-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <svg className="w-16 h-16 mx-auto mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold mb-4">ไม่พบข้อมูลกิจกรรม</h2>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            กลับสู่หน้ากิจกรรม
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto py-8 px-4">
        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center mb-6 px-4 py-2 rounded-md ${
            theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
          } transition-colors`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ย้อนกลับ
        </button>
        
        {/* ข้อความแจ้งเตือนการลงทะเบียน */}
        {registrationMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
            {registrationMessage}
          </div>
        )}
        
        {/* แสดงข้อความกรณีเกิดข้อผิดพลาด */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}
        
        <div className={`rounded-lg overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {/* รูปภาพกิจกรรม */}
          <div className="h-64 sm:h-80 md:h-96 relative">
            <img
              src={activity.imageUrl?.startsWith('http') 
                ? activity.imageUrl 
                : `https://bootcampp.karinwdev.site${activity.imageUrl}`}
              alt={activity.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/api/placeholder/400/320';
              }}
            />
            
            {/* แท็กแสดงประเภทและสถานะกิจกรรม */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(activity.type.id)}`}>
                {activity.type.name}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activity.status)}`}>
                {activity.status}
              </span>
            </div>
          </div>
          
          {/* รายละเอียดกิจกรรม */}
          <div className="p-6">
            <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {activity.title}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* รายละเอียดทั่วไป */}
              <div>
                <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  รายละเอียดกิจกรรม
                </h2>
                <p className={`mb-6 whitespace-pre-line ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {activity.description}
                </p>
                
                {/* ข้อมูลผู้จัดกิจกรรม */}
                <div className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-medium">ผู้จัด:</span> {activity.createdBy.name}
                </div>
              </div>
              
              {/* ข้อมูลวันเวลาและสถานที่ */}
              <div>
                <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  ข้อมูลกิจกรรม
                </h2>
                
                <div className={`mb-4 flex items-start ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div><span className="font-medium">เริ่ม:</span> {formatDateTime(activity.startTime)}</div>
                    <div><span className="font-medium">สิ้นสุด:</span> {formatDateTime(activity.endTime)}</div>
                  </div>
                </div>
                
                <div className={`mb-4 flex items-start ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>{activity.location}</div>
                </div>
                
                <div className={`mb-4 flex items-start ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <span className="font-medium">ผู้เข้าร่วม:</span> {activity.currentParticipants} / {activity.maxParticipants} คน
                  </div>
                </div>
              </div>
            </div>
            
            {/* ปุ่มลงทะเบียน */}
            {activity.status === 'รับสมัคร' && activity.currentParticipants < activity.maxParticipants && !isRegistered ? (
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className={`w-full md:w-auto px-6 py-3 rounded-md font-medium ${
                  isLoading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังดำเนินการ...
                  </span>
                ) : (
                  'ลงทะเบียนเข้าร่วมกิจกรรม'
                )}
              </button>
            ) : isRegistered ? (
              <div className={`p-4 border border-green-300 rounded-md ${theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-50 text-green-800'}`}>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  คุณได้ลงทะเบียนเข้าร่วมกิจกรรมนี้แล้ว
                </span>
              </div>
            ) : activity.currentParticipants >= activity.maxParticipants ? (
              <div className={`p-4 border border-yellow-300 rounded-md ${theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-50 text-yellow-800'}`}>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  กิจกรรมนี้มีผู้เข้าร่วมเต็มจำนวนแล้ว
                </span>
              </div>
            ) : (
              <div className={`p-4 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ไม่สามารถลงทะเบียนได้ เนื่องจากกิจกรรมไม่ได้อยู่ในช่วงรับสมัคร
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;