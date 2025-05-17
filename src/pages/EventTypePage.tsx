import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../stores/theme.store';
import { useAuth } from '../hooks/UseAuth.hook';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import { getActivitiesByType, filterApprovedActivities, filterActiveActivities } from '../services/activityService';
import LoadingPage from './LoadingPage';

// ประเภทสำหรับฟิลเตอร์การค้นหา
interface SearchFilterType {
  id: string;
  label: string;
  checked: boolean;
}

// แปลงพารามิเตอร์ประเภทเป็น ID
const getTypeIdFromParam = (typeParam: string): number => {
  switch (typeParam) {
    case 'training':
    case 'อบรม':
      return 1;
    case 'volunteer':
    case 'อาสา':
      return 2;
    case 'helper':
    case 'ช่วยงาน':
      return 3;
    default:
      return 1; // ค่าเริ่มต้น
  }
};

// แปลง ID ประเภทเป็นชื่อไทย
const getTypeNameFromId = (typeId: number): string => {
  switch (typeId) {
    case 1:
      return 'อบรม';
    case 2:
      return 'อาสา';
    case 3:
      return 'ช่วยงาน';
    default:
      return 'อบรม';
  }
};

function EventTypePage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { userRole, isAuthenticated } = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeId, setTypeId] = useState<number>(1);
  const [typeName, setTypeName] = useState<string>('อบรม');
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const eventsPerPage = 9; // 3 x 3 grid

  // ตั้งค่าประเภทกิจกรรมเมื่อพารามิเตอร์ URL เปลี่ยน
  useEffect(() => {
    if (type) {
      const id = getTypeIdFromParam(type);
      setTypeId(id);
      setTypeName(getTypeNameFromId(id));
    }
  }, [type]);

  // ดึงข้อมูลกิจกรรมเมื่อประเภทเปลี่ยน
  useEffect(() => {
    const fetchActivitiesByType = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // ดึง token จาก localStorage
        const authData = localStorage.getItem('authData');
        const token = authData ? JSON.parse(authData).token : '';
        
        // เรียกใช้ API เพื่อดึงข้อมูลกิจกรรมตามประเภท
        const result = await getActivitiesByType(typeId, token);
        
        // ตรวจสอบผลลัพธ์
        if (result && result.activities && Array.isArray(result.activities)) {
          let typedActivities = result.activities;
          
          // กรณีเป็นผู้ใช้ทั่วไป (นิสิต) ให้กรองเฉพาะกิจกรรมที่ approved
          if (userRole === 'student' || !isAuthenticated) {
            typedActivities = filterApprovedActivities(typedActivities);
          }
          
          // กรองกิจกรรมที่ไม่อยู่ในสถานะ closed หรือ cancelled
          typedActivities = filterActiveActivities(typedActivities);
          
          setActivities(typedActivities);
          setFilteredActivities(typedActivities);
        } else {
          setActivities([]);
          setFilteredActivities([]);
        }
      } catch (err) {
        console.error(`เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรมประเภท ${typeName}:`, err);
        setError(`เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม กรุณาลองใหม่อีกครั้ง`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivitiesByType();
  }, [typeId, userRole, isAuthenticated, typeName]);

  // ฟังก์ชันสำหรับการค้นหาในหน้านี้
  const handleSearch = (query: string, filters: SearchFilterType[]) => {
    setSearchTerm(query);
    
    if (query) {
      // กรองกิจกรรมตามคำค้นหา
      const filtered = activities.filter(activity => {
        const title = activity.title.toLowerCase();
        const description = activity.description ? activity.description.toLowerCase() : '';
        const location = activity.location ? activity.location.toLowerCase() : '';
        const organizerName = activity.createdBy.name.toLowerCase();
        const searchLower = query.toLowerCase();
        
        return (
          title.includes(searchLower) ||
          description.includes(searchLower) ||
          location.includes(searchLower) ||
          organizerName.includes(searchLower)
        );
      });
      
      setFilteredActivities(filtered);
    } else {
      // ถ้าไม่มีคำค้นหา แสดงทั้งหมด
      setFilteredActivities(activities);
    }
    
    // รีเซ็ตกลับไปหน้าแรก
    setCurrentPage(1);
    
    // หากมีการค้นหาโดยใช้คำค้นหา แต่ต้องการค้นหาในทุกประเภท ให้ redirect ไปยังหน้าค้นหา
    if (query && filters.some(f => f.checked)) {
      // นำทางไปยังหน้าค้นหาพร้อมพารามิเตอร์
      const searchParams = new URLSearchParams();
      if (query) searchParams.set('q', query);
      
      // กำหนดฟิลเตอร์ตามประเภทที่กำลังดูอยู่
      filters.forEach(filter => {
        if (filter.checked) {
          searchParams.set(filter.id, 'true');
        }
      });
      
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredActivities.length / eventsPerPage);

  // อินเด็กซ์ของกิจกรรมแรกและสุดท้ายที่แสดงในหน้าปัจจุบัน
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredActivities.slice(indexOfFirstEvent, indexOfLastEvent);

  // ฟังก์ชันเปลี่ยนหน้า
  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // กำหนดสีตามประเภทกิจกรรม
  const getEventTypeColor = (): string => {
    switch (typeId) {
      case 1: // อบรม
        return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 2: // อาสา
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 3: // ช่วยงาน
        return theme === 'dark' ? 'text-purple-400' : 'text-purple-600';
      default:
        return '';
    }
  };

  // แสดงข้อความระบุสถานะการอนุมัติในส่วนหัวของหน้า (เฉพาะเจ้าหน้าที่และแอดมิน)
  const renderApprovalStatusInfo = () => {
    if (userRole !== 'staff' && userRole !== 'admin') return null;
    
    return (
      <div className={`p-4 mb-6 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
        <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
          <span className="font-bold">หมายเหตุ:</span> กิจกรรมที่แสดงต่อผู้ใช้ทั่วไปต้องมีสถานะ "approved" เท่านั้น
          {userRole === 'staff' && (
            <>
              {' '}คุณจะเห็นกิจกรรมที่รออนุมัติหรือไม่อนุมัติเฉพาะที่คุณสร้างขึ้นเท่านั้น
            </>
          )}
          {userRole === 'admin' && (
            <>
              {' '}ในฐานะผู้ดูแลระบบ คุณสามารถเห็นกิจกรรมทั้งหมดในทุกสถานะ
            </>
          )}
        </p>
      </div>
    );
  };

  // แสดง LoadingPage ถ้ากำลังโหลดข้อมูล
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto py-8 px-4">
        {/* Search Bar - ทำให้เลื่อนตามจอ */}
        <div className="sticky top-0 z-10 py-4 mb-8">
          <SearchBar 
            onSearch={handleSearch}
            className="mb-4"
          />
        </div>

        {/* Header with Type */}
        <div className="flex items-center mb-6">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            ประเภท
          </h1>
          <span className={`ml-3 text-3xl font-bold ${getEventTypeColor()}`}>
            {typeName}
          </span>
        </div>
        
        {/* แสดงข้อความกรณีเกิดข้อผิดพลาด */}
        {error && (
          <div className={`mb-6 p-4 rounded-md ${
            theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
          }`}>
            {error}
          </div>
        )}
        
        {/* ข้อความแสดงสถานะการอนุมัติ (เฉพาะเจ้าหน้าที่และแอดมิน) */}
        {renderApprovalStatusInfo()}

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {/* ถ้าไม่มีกิจกรรมที่ตรงกับเงื่อนไข */}
        {currentEvents.length === 0 && (
          <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-xl">ไม่พบกิจกรรมที่ตรงกับเงื่อนไข</p>
            {searchTerm && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilteredActivities(activities);
                }}
                className={`mt-4 px-4 py-2 rounded-md ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                ล้างการค้นหา
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md mr-2 ${
                currentPage === 1 
                  ? `${theme === 'dark' ? 'bg-gray-800 text-gray-600' : 'bg-gray-200 text-gray-400'} cursor-not-allowed` 
                  : `${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`
              }`}
              aria-label="ไปยังหน้าก่อนหน้า"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* แสดงปุ่มหมายเลขหน้า */}
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
              // คำนวณหมายเลขหน้าที่จะแสดง
              let pageNumber;
              if (totalPages <= 5) {
                // ถ้ามีน้อยกว่า 5 หน้า แสดงทั้งหมด
                pageNumber = index + 1;
              } else if (currentPage <= 3) {
                // ถ้าอยู่ใกล้หน้าแรก แสดง 1-5
                pageNumber = index + 1;
              } else if (currentPage >= totalPages - 2) {
                // ถ้าอยู่ใกล้หน้าสุดท้าย แสดง 5 หน้าสุดท้าย
                pageNumber = totalPages - 4 + index;
              } else {
                // อยู่ตรงกลาง แสดงหน้าปัจจุบัน และหน้าข้างเคียง
                pageNumber = currentPage - 2 + index;
              }
              
              return (
                <button
                  key={index}
                  onClick={() => paginate(pageNumber)}
                  className={`px-3 py-1 rounded-md mx-1 ${
                    currentPage === pageNumber
                      ? `${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`
                      : `${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`
                  }`}
                  aria-label={`ไปยังหน้า ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ml-2 ${
                currentPage === totalPages 
                  ? `${theme === 'dark' ? 'bg-gray-800 text-gray-600' : 'bg-gray-200 text-gray-400'} cursor-not-allowed` 
                  : `${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`
              }`}
              aria-label="ไปยังหน้าถัดไป"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventTypePage;