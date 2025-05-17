import { useState, useEffect } from 'react';
import { useTheme } from '../stores/theme.store';
import { Link } from 'react-router-dom';

// ประเภทข้อมูลสำหรับประวัติกิจกรรม
interface HistoryItem {
  id: string;
  title: string;
  eventType: 'อบรม' | 'อาสา' | 'ช่วยงาน';
  startDate: string;
  endDate: string;
  participationType: 'ผู้เข้าร่วมกิจกรรม' | 'ผู้จัดกิจกรรม';
  passed: boolean;
}

// ประเภทสำหรับการเรียงข้อมูล
type SortField = 'title' | 'eventType' | 'startDate' | 'endDate' | 'participationType' | 'passed';
type SortOrder = 'asc' | 'desc';

function HistoryPage() {
  const { theme } = useTheme();
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');

  useEffect(() => {
    // ข้อมูลตัวอย่าง (ในโปรเจคจริง ควรใช้ API เพื่อดึงข้อมูล)
    const sampleHistories: HistoryItem[] = [
      {
        id: '1',
        title: 'BootCampCPE',
        eventType: 'อบรม',
        startDate: '17/05/2568',
        endDate: '18/05/2568',
        participationType: 'ผู้เข้าร่วมกิจกรรม',
        passed: true,
      },
      {
        id: '2',
        title: 'ปลูกป่าชายเลนเพื่อโลกสีเขียว',
        eventType: 'อาสา',
        startDate: '22/05/2567',
        endDate: '22/05/2567',
        participationType: 'ผู้เข้าร่วมกิจกรรม',
        passed: true,
      },
      {
        id: '3',
        title: 'งานวิ่งการกุศล Run for Wildlife',
        eventType: 'ช่วยงาน',
        startDate: '30/05/2567',
        endDate: '30/05/2567',
        participationType: 'ผู้เข้าร่วมกิจกรรม',
        passed: false,
      },
      {
        id: '4',
        title: 'อบรมปฐมพยาบาลเบื้องต้น',
        eventType: 'อบรม',
        startDate: '10/04/2567',
        endDate: '10/04/2567',
        participationType: 'ผู้จัดกิจกรรม',
        passed: true,
      },
      {
        id: '5',
        title: 'ค่ายอาสาพัฒนาโรงเรียน',
        eventType: 'อาสา',
        startDate: '01/03/2567',
        endDate: '03/03/2567',
        participationType: 'ผู้เข้าร่วมกิจกรรม',
        passed: true,
      },
      {
        id: '6',
        title: 'อบรมทักษะการนำเสนอ',
        eventType: 'อบรม',
        startDate: '15/02/2567',
        endDate: '16/02/2567',
        participationType: 'ผู้เข้าร่วมกิจกรรม',
        passed: true,
      },
      {
        id: '7',
        title: 'งานบริจาคโลหิต',
        eventType: 'ช่วยงาน',
        startDate: '25/01/2567',
        endDate: '25/01/2567',
        participationType: 'ผู้จัดกิจกรรม',
        passed: true,
      },
      {
        id: '8',
        title: 'โครงการสอนน้อง ปันความรู้สู่ชุมชน',
        eventType: 'อาสา',
        startDate: '10/01/2567',
        endDate: '31/01/2567',
        participationType: 'ผู้เข้าร่วมกิจกรรม',
        passed: false,
      },
    ];

    setHistories(sampleHistories);
  }, []);

  // ฟังก์ชันเรียงข้อมูล
  const sortHistories = (field: SortField) => {
    if (sortField === field) {
      // ถ้าคลิกที่ฟิลด์เดิม ให้สลับลำดับการเรียง
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // ถ้าคลิกที่ฟิลด์ใหม่ ให้เรียงจากน้อยไปมาก
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // กรองและเรียงข้อมูล
  const filteredAndSortedHistories = histories
    .filter(history => 
      history.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === '' || history.eventType === filterType)
    )
    .sort((a, b) => {
      // เรียงตามฟิลด์ที่เลือก
      if (sortField === 'passed') {
        // สำหรับการเรียงตามสถานะการผ่าน
        return sortOrder === 'asc' 
          ? (a.passed === b.passed ? 0 : a.passed ? 1 : -1) 
          : (a.passed === b.passed ? 0 : a.passed ? -1 : 1);
      } else {
        // สำหรับฟิลด์อื่นๆ
        const compareA = String(a[sortField]).toLowerCase();
        const compareB = String(b[sortField]).toLowerCase();
        
        if (compareA < compareB) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (compareA > compareB) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });

  // คำนวณหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedHistories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedHistories.length / itemsPerPage);

  // สีประเภทกิจกรรม
  const eventTypeColor = (type: string) => {
    switch (type) {
      case 'อบรม':
        return theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white';
      case 'อาสา':
        return theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-600 text-white';
      case 'ช่วยงาน':
        return theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white';
      default:
        return '';
    }
  };

  // กำหนดสี header bar ตามธีม
  const getHeaderBarColor = () => {
    return theme === 'dark' 
      ? 'bg-blue-800' // โทนสีน้ำเงินเข้มสำหรับ Dark Mode
      : 'bg-blue-600'; // โทนสีน้ำเงินสำหรับ Light Mode
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">ประวัติกิจกรรม</h1>
        
        {/* ส่วนค้นหาและตัวกรอง */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="ค้นหากิจกรรม..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } border`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border`}
            >
              <option value="">ทุกประเภท</option>
              <option value="อบรม">อบรม</option>
              <option value="อาสา">อาสา</option>
              <option value="ช่วยงาน">ช่วยงาน</option>
            </select>
          </div>
        </div>
        
        {/* ตารางประวัติกิจกรรม */}
        <div className={`overflow-x-auto rounded-lg border ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${getHeaderBarColor()} text-white`}>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortHistories('title')}
                >
                  <div className="flex items-center">
                    ชื่อกิจกรรม
                    {sortField === 'title' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortHistories('eventType')}
                >
                  <div className="flex items-center">
                    ประเภทกิจกรรม
                    {sortField === 'eventType' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortHistories('startDate')}
                >
                  <div className="flex items-center">
                    วันที่เริ่มต้น
                    {sortField === 'startDate' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortHistories('endDate')}
                >
                  <div className="flex items-center">
                    วันที่สิ้นสุด
                    {sortField === 'endDate' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortHistories('participationType')}
                >
                  <div className="flex items-center">
                    ประเภทการเข้าร่วม
                    {sortField === 'participationType' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortHistories('passed')}
                >
                  <div className="flex items-center">
                    ผ่านกิจกรรม
                    {sortField === 'passed' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
            }`}>
              {currentItems.length > 0 ? (
                currentItems.map((history) => (
                  <tr key={history.id} className={`hover:${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/events/${history.id}`} 
                        className={`font-medium ${
                          theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                        }`}
                      >
                        {history.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventTypeColor(history.eventType)}`}>
                        {history.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {history.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {history.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {history.participationType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {history.passed ? (
                        <span className="inline-flex justify-center text-green-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex justify-center text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm font-medium"
                  >
                    ไม่พบประวัติกิจกรรมที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredAndSortedHistories.length > 0 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-200'
                } ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNumber
                        ? theme === 'dark'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-200'
                } ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;