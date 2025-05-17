import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../stores/theme.store';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import { filterEventsByPermission, mockEventsWithApproval } from '../data/mockEventsWithApproval';
import { useAuth } from '../hooks/UseAuth.hook';

// ตัวเลือกประเภทกิจกรรม
type EventType = 'อบรม' | 'อาสา' | 'ช่วยงาน';

// ประเภทสำหรับฟิลเตอร์การค้นหา
interface SearchFilterType {
  id: string;
  label: string;
  checked: boolean;
}

function EventTypePage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { userRole, userId } = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<typeof mockEventsWithApproval>([]);
  const eventsPerPage = 9; // 3 x 3 grid

  // แปลงประเภทกิจกรรมจาก URL parameter (ที่อาจจะเป็นภาษาอังกฤษหรือถูกเข้ารหัส) เป็นภาษาไทย
  const getEventTypeFromParam = (): EventType => {
    if (type === 'training' || type === 'อบรม') return 'อบรม';
    if (type === 'volunteer' || type === 'อาสา') return 'อาสา';
    if (type === 'helper' || type === 'ช่วยงาน') return 'ช่วยงาน';
    return 'อบรม'; // ค่าเริ่มต้น
  };

  const eventType = getEventTypeFromParam();

  // กำหนดสีตามประเภทกิจกรรม
  const getEventTypeColor = (type: EventType): string => {
    const colorMap: Record<EventType, string> = {
      'อบรม': 'text-blue-600',
      'อาสา': 'text-green-600',
      'ช่วยงาน': 'text-purple-600'
    };
    return colorMap[type];
  };

  // กรองกิจกรรมตามประเภทและคำค้นหา
  useEffect(() => {
    // 1. กรองตามสิทธิ์การเข้าถึง
    const accessFilteredEvents = filterEventsByPermission(mockEventsWithApproval, userRole, userId);
    
    // 2. กรองตามประเภทและคำค้นหา
    const filtered = accessFilteredEvents.filter(event => {
      // กรองตามประเภท
      if (event.eventType !== eventType) return false;
      
      // กรองตามคำค้นหา (ถ้ามี)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower) ||
          event.organizer.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
    
    setFilteredEvents(filtered);
    setCurrentPage(1); // รีเซ็ตหน้าเมื่อมีการเปลี่ยนแปลงการกรอง
  }, [eventType, searchTerm, userRole, userId]);

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // อินเด็กซ์ของกิจกรรมแรกและสุดท้ายที่แสดงในหน้าปัจจุบัน
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // ฟังก์ชันเปลี่ยนหน้า
  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ฟังก์ชันสำหรับการค้นหา
  const handleSearch = (query: string, filters: SearchFilterType[]) => {
    setSearchTerm(query);
    
    // หากมีการค้นหาโดยใช้คำค้นหา แต่ไม่ได้เลือกฟิลเตอร์ ให้ redirect ไปยังหน้าค้นหา
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

  // แสดงข้อความระบุสถานะการอนุมัติในส่วนหัวของหน้า (เฉพาะเจ้าหน้าที่และแอดมิน)
  const renderApprovalStatusInfo = () => {
    if (userRole !== 'staff' && userRole !== 'admin') return null;
    
    return (
      <div className={`p-4 mb-6 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
        <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
          <span className="font-bold">หมายเหตุ:</span> กิจกรรมที่แสดงต่อผู้ใช้ทั่วไปต้องมีสถานะ "อนุมัติ" เท่านั้น
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
          <span className={`ml-3 text-3xl font-bold ${getEventTypeColor(eventType)}`}>
            {eventType}
          </span>
        </div>
        
        {/* ข้อความแสดงสถานะการอนุมัติ (เฉพาะเจ้าหน้าที่และแอดมิน) */}
        {renderApprovalStatusInfo()}

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentEvents.map((event) => (
            <Link to={`/events/detail/${event.id}`} key={event.id}>
              <EventCard
                key={event.id}
                {...event}
              />
            </Link>
          ))}
        </div>

        {/* ถ้าไม่มีกิจกรรมที่ตรงกับเงื่อนไข */}
        {currentEvents.length === 0 && (
          <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-xl">ไม่พบกิจกรรมที่ตรงกับเงื่อนไข</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
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