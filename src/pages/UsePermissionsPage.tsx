import { useState, useEffect } from 'react';
import { useTheme } from '../stores/theme.store';
import { Link } from 'react-router-dom';

// ประเภทข้อมูลสำหรับผู้ใช้
interface UserItem {
  id: string;
  name: string;
  studentId: string;
  faculty: string;
  email: string;
  isStaff: boolean;
}

// ประเภทสำหรับการเรียงข้อมูล
type SortField = 'name' | 'studentId' | 'faculty' | 'email' | 'isStaff';
type SortOrder = 'asc' | 'desc';

function UserPermissionsPage() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStaff, setFilterStaff] = useState<string>('');

  useEffect(() => {
    // ข้อมูลตัวอย่าง (ในโปรเจคจริง ควรใช้ API เพื่อดึงข้อมูล)
    const sampleUsers: UserItem[] = [
      {
        id: '1',
        name: 'นายสมชาย ใจดี',
        studentId: '65015001',
        faculty: 'คณะวิทยาศาสตร์',
        email: '65015001@up.ac.th',
        isStaff: false,
      },
      {
        id: '2',
        name: 'นางสาวสมหญิง รักเรียน',
        studentId: '65015002',
        faculty: 'คณะวิศวกรรมศาสตร์',
        email: '65015002@up.ac.th',
        isStaff: true,
      },
      {
        id: '3',
        name: 'นายวิชัย เก่งกาจ',
        studentId: '65015003',
        faculty: 'คณะวิทยาศาสตร์',
        email: '65015003@up.ac.th',
        isStaff: false,
      },
      {
        id: '4',
        name: 'นางสาวแก้วตา สว่างศรี',
        studentId: '65015004',
        faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
        email: '65015004@up.ac.th',
        isStaff: true,
      },
      {
        id: '5',
        name: 'นายภูมิ ปัญญาดี',
        studentId: '65015005',
        faculty: 'คณะวิศวกรรมศาสตร์',
        email: '65015005@up.ac.th',
        isStaff: false,
      },
      {
        id: '6',
        name: 'นางสาวนิภา ใจงาม',
        studentId: '65015006',
        faculty: 'คณะวิทยาศาสตร์',
        email: '65015006@up.ac.th',
        isStaff: true,
      },
      {
        id: '7',
        name: 'นายอนันต์ มากมี',
        studentId: '65015007',
        faculty: 'คณะวิศวกรรมศาสตร์',
        email: '65015007@up.ac.th',
        isStaff: false,
      },
      {
        id: '8',
        name: 'นางสาวกานดา รักดี',
        studentId: '65015008',
        faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
        email: '65015008@up.ac.th',
        isStaff: false,
      },
      {
        id: '9',
        name: 'นายพงศกร เพียรเรียน',
        studentId: '65015009',
        faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
        email: '65015009@up.ac.th',
        isStaff: true,
      },
      {
        id: '10',
        name: 'นางสาวมินตรา ใจซื่อ',
        studentId: '65015010',
        faculty: 'คณะวิทยาศาสตร์',
        email: '65015010@up.ac.th',
        isStaff: false,
      },
    ];

    setUsers(sampleUsers);
  }, []);

  // ฟังก์ชันเรียงข้อมูล
  const sortUsers = (field: SortField) => {
    if (sortField === field) {
      // ถ้าคลิกที่ฟิลด์เดิม ให้สลับลำดับการเรียง
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // ถ้าคลิกที่ฟิลด์ใหม่ ให้เรียงจากน้อยไปมาก
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // ฟังก์ชันจัดการการแต่งตั้ง staff
  const handleAppoint = (id: string) => {
    const confirmed = window.confirm('คุณต้องการแต่งตั้งผู้ใช้นี้เป็นเจ้าหน้าที่ใช่หรือไม่?');
    if (confirmed) {
      setUsers(users.map(user => 
        user.id === id ? { ...user, isStaff: true } : user
      ));
    }
  };

  // ฟังก์ชันจัดการการยกเลิก staff
  const handleRevoke = (id: string) => {
    const confirmed = window.confirm('คุณต้องการยกเลิกตำแหน่งเจ้าหน้าที่ของผู้ใช้นี้ใช่หรือไม่?');
    if (confirmed) {
      setUsers(users.map(user => 
        user.id === id ? { ...user, isStaff: false } : user
      ));
    }
  };

  // กรองและเรียงข้อมูล
  const filteredAndSortedUsers = users
    .filter(user => 
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.studentId.includes(searchTerm) ||
       user.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStaff === '' || 
        (filterStaff === 'staff' && user.isStaff) || 
        (filterStaff === 'user' && !user.isStaff))
    )
    .sort((a, b) => {
      // เรียงตามฟิลด์ที่เลือก
      if (sortField === 'isStaff') {
        // สำหรับการเรียงตามสถานะ Staff
        if (sortOrder === 'asc') {
          return a.isStaff === b.isStaff ? 0 : a.isStaff ? 1 : -1;
        } else {
          return a.isStaff === b.isStaff ? 0 : a.isStaff ? -1 : 1;
        }
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
  const currentItems = filteredAndSortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  // กำหนดสี header bar ตามธีม
  const getHeaderBarColor = () => {
    return theme === 'dark' 
      ? 'bg-blue-800' // โทนสีน้ำเงินเข้มสำหรับ Dark Mode
      : 'bg-blue-600'; // โทนสีน้ำเงินสำหรับ Light Mode
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">จัดการสิทธิ์ผู้ใช้</h1>
        
        {/* ส่วนค้นหาและตัวกรอง */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="ค้นหาผู้ใช้..."
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
              value={filterStaff}
              onChange={(e) => setFilterStaff(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border`}
            >
              <option value="">ทั้งหมด</option>
              <option value="staff">เจ้าหน้าที่</option>
              <option value="user">นิสิต</option>
            </select>
          </div>
        </div>
        
        {/* ตารางผู้ใช้ */}
        <div className={`overflow-x-auto rounded-lg border ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${getHeaderBarColor()} text-white`}>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortUsers('name')}
                >
                  <div className="flex items-center">
                    ชื่อผู้ใช้
                    {sortField === 'name' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortUsers('studentId')}
                >
                  <div className="flex items-center">
                    รหัสนิสิต
                    {sortField === 'studentId' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortUsers('faculty')}
                >
                  <div className="flex items-center">
                    คณะ
                    {sortField === 'faculty' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortUsers('email')}
                >
                  <div className="flex items-center">
                    อีเมล
                    {sortField === 'email' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortUsers('isStaff')}
                >
                  <div className="flex items-center">
                    สถานะ Staff
                    {sortField === 'isStaff' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-sm font-medium"
                >
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
            }`}>
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr key={user.id} className={`hover:${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="truncate max-w-[150px]" title={user.faculty}>
                        {user.faculty}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isStaff
                          ? theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                          : theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isStaff ? 'เจ้าหน้าที่' : 'นิสิต'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex justify-center space-x-2">
                        {user.isStaff ? (
                          <button
                            onClick={() => handleRevoke(user.id)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md ${
                              theme === 'dark' 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-red-600 text-white hover:bg-red-700'
                            } transition-colors`}
                          >
                            ยกเลิก Staff
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAppoint(user.id)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md ${
                              theme === 'dark' 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            } transition-colors`}
                          >
                            แต่งตั้ง Staff
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm font-medium"
                  >
                    ไม่พบผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredAndSortedUsers.length > 0 && (
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

export default UserPermissionsPage;