import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../stores/theme.store';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import { searchEvents, filterEventsByPermission, mockEventsWithApproval } from '../data/mockEventsWithApproval';
import { useAuth } from '../hooks/UseAuth.hook';

// ประเภทสำหรับฟิลเตอร์การค้นหา
interface SearchFilterType {
  id: string;
  label: string;
  checked: boolean;
}

function SearchEventPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { userRole, userId } = useAuth();
  
  // ดึงค่า query parameters จาก URL
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get('q') || '';
  const initialFilters = {
    training: queryParams.get('training') === 'true',
    volunteer: queryParams.get('volunteer') === 'true',
    helper: queryParams.get('helper') === 'true'
  };

  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<typeof mockEventsWithApproval>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilterType[]>([
    { id: 'training', label: 'อบรม', checked: initialFilters.training },
    { id: 'volunteer', label: 'อาสา', checked: initialFilters.volunteer },
    { id: 'helper', label: 'ช่วยงาน', checked: initialFilters.helper }
  ]);
  
  const eventsPerPage = 9; // 3 คอลัมน์ x 3 แถวต่อหน้า
  
  // ทำการค้นหาเมื่อโหลดหน้าด้วยค่าจาก URL
  useEffect(() => {
    if (initialSearchQuery || Object.values(initialFilters).some(value => value)) {
      performSearch(initialSearchQuery, searchFilters);
    }
  }, [userRole, userId]);

  // ฟังก์ชันสำหรับการค้นหา
  const performSearch = (query: string, filters: SearchFilterType[]) => {
    // แปลง searchFilters เป็นรูปแบบที่ searchEvents ต้องการ
    const filterOptions = {
      training: filters.find(f => f.id === 'training')?.checked || false,
      volunteer: filters.find(f => f.id === 'volunteer')?.checked || false,
      helper: filters.find(f => f.id === 'helper')?.checked || false
    };
    
    // ใช้ฟังก์ชัน searchEvents ที่ปรับปรุงแล้วเพื่อให้คำนึงถึงสิทธิ์การเข้าถึง
    const results = searchEvents(query, filterOptions, userRole, userId);
    setSearchResults(results);
    setSearchPerformed(true);
    setCurrentPage(1);
    
    // อัพเดท URL search params
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filterOptions.training) params.set('training', 'true');
    if (filterOptions.volunteer) params.set('volunteer', 'true');
    if (filterOptions.helper) params.set('helper', 'true');
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  };
  
  // ฟังก์ชันสำหรับรับผลการค้นหาจาก SearchBar
  const handleSearch = (query: string, filters: SearchFilterType[]) => {
    setSearchTerm(query);
    setSearchFilters(filters);
    performSearch(query, filters);
  };
  
  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(searchResults.length / eventsPerPage);
  
  // คำนวณอินเด็กซ์ของกิจกรรมแรกและสุดท้ายที่แสดงในหน้าปัจจุบัน
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = searchResults.slice(indexOfFirstEvent, indexOfLastEvent);
  
  // ฟังก์ชันเปลี่ยนหน้า
  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            ค้นหากิจกรรม
          </h1>
          {searchTerm && (
            <span className={`ml-3 text-xl font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              "{searchTerm}"
            </span>
          )}
        </div>
        
        {/* ข้อความแสดงสถานะการอนุมัติ (เฉพาะเจ้าหน้าที่และแอดมิน) */}
        {renderApprovalStatusInfo()}
        
        {/* แสดงผลการค้นหา */}
        {searchPerformed ? (
          searchResults.length > 0 ? (
            <>
              {/* จำนวนผลการค้นหา */}
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                พบ {searchResults.length} กิจกรรมที่ตรงกับการค้นหา
              </p>
              
              {/* Event Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    {...event}
                  />
                ))}
              </div>
              
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
            </>
          ) : (
            // กรณีไม่พบผลการค้นหา
            <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <h2 className="text-xl font-semibold mb-2">ไม่พบกิจกรรมที่ตรงกับการค้นหา</h2>
              <p className="mb-4">ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองประเภทกิจกรรม</p>
              <button 
                onClick={() => {
                  // รีเซ็ตการค้นหา
                  setSearchTerm('');
                  setSearchFilters([
                    { id: 'training', label: 'อบรม', checked: false },
                    { id: 'volunteer', label: 'อาสา', checked: false },
                    { id: 'helper', label: 'ช่วยงาน', checked: false }
                  ]);
                  setSearchPerformed(false);
                  navigate('/search');
                }}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                ล้างการค้นหา
              </button>
            </div>
          )
        ) : (
          // กรณียังไม่มีการค้นหา
          <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <h2 className="text-xl font-semibold mb-2">ค้นหากิจกรรมที่สนใจ</h2>
            <p>ใช้ช่องค้นหาด้านบนเพื่อค้นหากิจกรรมที่ต้องการ</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchEventPage;