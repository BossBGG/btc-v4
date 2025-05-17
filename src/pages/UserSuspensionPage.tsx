import { useState, useEffect } from 'react';
import { useTheme } from '../stores/theme.store';
import { useNavigate } from 'react-router-dom';

// ประเภทข้อมูลสำหรับผู้ใช้งาน
interface UserItem {
  id: string;
  name: string;
  studentId: string;
  role: 'นิสิต' | 'เจ้าหน้าที่';
  faculty: string;
  major: string;
  lastLoginDate: string;
  email: string;
  isSuspended: boolean;
}

// ประเภทสำหรับการเรียงข้อมูล
type SortField = 'name' | 'studentId' | 'role' | 'faculty' | 'major' | 'lastLoginDate' | 'isSuspended';
type SortOrder = 'asc' | 'desc';

function UserSuspensionPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('lastLoginDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    // ข้อมูลตัวอย่าง (ในโปรเจคจริง ควรใช้ API เพื่อดึงข้อมูล)
    const sampleUsers: UserItem[] = [
      {
        id: '1',
        name: 'นายสมชาย ใจดี',
        studentId: '65015001',
        role: 'นิสิต',
        faculty: 'คณะวิทยาศาสตร์',
        major: 'วิทยาการคอมพิวเตอร์',
        lastLoginDate: '17/05/2568',
        email: '65015001@up.ac.th',
        isSuspended: false
      },
      {
        id: '2',
        name: 'นางสาวสมหญิง รักเรียน',
        studentId: '65015002',
        role: 'นิสิต',
        faculty: 'คณะวิศวกรรมศาสตร์',
        major: 'วิศวกรรมคอมพิวเตอร์',
        lastLoginDate: '16/05/2568',
        email: '65015002@up.ac.th',
        isSuspended: true
      },
      {
        id: '3',
        name: 'นายวิชัย เก่งกาจ',
        studentId: '65015003',
        role: 'นิสิต',
        faculty: 'คณะวิทยาศาสตร์',
        major: 'ฟิสิกส์',
        lastLoginDate: '15/05/2568',
        email: '65015003@up.ac.th',
        isSuspended: false
      },
      {
        id: '4',
        name: 'นายพงศกร มหาศาล',
        studentId: '26015001',
        role: 'เจ้าหน้าที่',
        faculty: 'คณะวิศวกรรมศาสตร์',
        major: 'วิศวกรรมไฟฟ้า',
        lastLoginDate: '16/05/2568',
        email: '26015001@up.ac.th',
        isSuspended: false
      },
      {
        id: '5',
        name: 'นางสาวพิมพ์ใจ ดีงาม',
        studentId: '26015002',
        role: 'เจ้าหน้าที่',
        faculty: 'คณะวิทยาศาสตร์',
        major: 'เคมี',
        lastLoginDate: '14/05/2568',
        email: '26015002@up.ac.th',
        isSuspended: true
      },
      {
        id: '6',
        name: 'นายอนันต์ มากมี',
        studentId: '65015006',
        role: 'นิสิต',
        faculty: 'คณะวิศวกรรมศาสตร์',
        major: 'วิศวกรรมโยธา',
        lastLoginDate: '13/05/2568',
        email: '65015006@up.ac.th',
        isSuspended: false
      },
      {
        id: '7',
        name: 'นางสาวกานดา รักดี',
        studentId: '65015007',
        role: 'นิสิต',
        faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
        major: 'รัฐศาสตร์',
        lastLoginDate: '12/05/2568',
        email: '65015007@up.ac.th',
        isSuspended: false
      },
      {
        id: '8',
        name: 'นายพงศกร เพียรเรียน',
        studentId: '65015008',
        role: 'นิสิต',
        faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
        major: 'นิติศาสตร์',
        lastLoginDate: '11/05/2568',
        email: '65015008@up.ac.th',
        isSuspended: false
      },
      {
        id: '9',
        name: 'นางสาวมินตรา ใจซื่อ',
        studentId: '65015009',
        role: 'นิสิต',
        faculty: 'คณะวิทยาศาสตร์',
        major: 'วิทยาการคอมพิวเตอร์',
        lastLoginDate: '10/05/2568',
        email: '65015009@up.ac.th',
        isSuspended: false
      },
      {
        id: '10',
        name: 'นายธนกร รวยทรัพย์',
        studentId: '65015010',
        role: 'นิสิต',
        faculty: 'คณะวิศวกรรมศาสตร์',
        major: 'วิศวกรรมคอมพิวเตอร์',
        lastLoginDate: '09/05/2568',
        email: '65015010@up.ac.th',
        isSuspended: false
      },
      {
        id: '11',
        name: 'นางสาววรรณิกา รักธรรม',
        studentId: '65015011',
        role: 'นิสิต',
        faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
        major: 'ภาษาอังกฤษ',
        lastLoginDate: '08/05/2568',
        email: '65015011@up.ac.th',
        isSuspended: false
      },
      {
        id: '12',
        name: 'นายพีรพล เรียนดี',
        studentId: '65015012',
        role: 'นิสิต',
        faculty: 'คณะวิทยาศาสตร์',
        major: 'ฟิสิกส์',
        lastLoginDate: '07/05/2568',
        email: '65015012@up.ac.th',
        isSuspended: false
      },
      {
        id: '13',
        name: 'นางสาวพนิดา งามพริ้ง',
        studentId: '26015003',
        role: 'เจ้าหน้าที่',
        faculty: 'คณะวิศวกรรมศาสตร์',
        major: 'วิศวกรรมไฟฟ้า',
        lastLoginDate: '06/05/2568',
        email: '26015003@up.ac.th',
        isSuspended: false
      },
      {
        id: '14',
        name: 'นายณัฐพล ศรีสุวรรณ',
        studentId: '26015004',
        role: 'เจ้าหน้าที่',
        faculty: 'คณะวิทยาศาสตร์',
        major: 'คณิตศาสตร์',
        lastLoginDate: '05/05/2568',
        email: '26015004@up.ac.th',
        isSuspended: false
      },
      {
        id: '15',
        name: 'นางสาวนุชนาถ จิตใส',
        studentId: '26015005',
        role: 'เจ้าหน้าที่',
        faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
        major: 'ภาษาอังกฤษ',
        lastLoginDate: '04/05/2568',
        email: '26015005@up.ac.th',
        isSuspended: false
      }
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

  // ฟังก์ชันจัดการการระงับบัญชี
  const handleSuspendUser = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isSuspended: true } : user
    ));
  };

  // ฟังก์ชันจัดการการยกเลิกระงับบัญชี
  const handleUnsuspendUser = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isSuspended: false } : user
    ));
  };

  // กรองและเรียงข้อมูล
  const filteredAndSortedUsers = users
    .filter(user => 
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.studentId.includes(searchTerm) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === '' || user.role === filterRole) &&
      (filterStatus === '' || 
       (filterStatus === 'ระงับแล้ว' && user.isSuspended) || 
       (filterStatus === 'ปกติ' && !user.isSuspended))
    )
    .sort((a, b) => {
      if (sortField === 'isSuspended') {
        // สำหรับการเรียงตามสถานะการระงับ
        return sortOrder === 'asc' 
          ? (a.isSuspended === b.isSuspended ? 0 : a.isSuspended ? 1 : -1) 
          : (a.isSuspended === b.isSuspended ? 0 : a.isSuspended ? -1 : 1);
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
        <h1 className="text-2xl font-bold mb-6">ระบบระงับบัญชีผู้ใช้</h1>
        
        {/* ส่วนค้นหาและตัวกรอง */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
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
          
          {/* ตัวกรองบทบาท */}
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border`}
            >
              <option value="">ทุกบทบาท</option>
              <option value="นิสิต">นิสิต</option>
              <option value="เจ้าหน้าที่">เจ้าหน้าที่</option>
            </select>
          </div>
          
          {/* ตัวกรองสถานะ */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border`}
            >
              <option value="">ทุกสถานะ</option>
              <option value="ปกติ">ปกติ</option>
              <option value="ระงับแล้ว">ระงับแล้ว</option>
            </select>
          </div>
        </div>
        
        {/* ตารางผู้ใช้งาน */}
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
                    รหัสประจำตัว
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
                  onClick={() => sortUsers('role')}
                >
                  <div className="flex items-center">
                    บทบาท
                    {sortField === 'role' && (
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
                  onClick={() => sortUsers('lastLoginDate')}
                >
                  <div className="flex items-center">
                    เข้าสู่ระบบล่าสุด
                    {sortField === 'lastLoginDate' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortUsers('isSuspended')}
                >
                  <div className="flex items-center">
                    สถานะ
                    {sortField === 'isSuspended' && (
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
                      <div className="text-xs text-gray-500">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'เจ้าหน้าที่' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-green-600 text-white'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="truncate max-w-[150px]" title={`${user.faculty} ${user.major}`}>
                        {user.faculty}
                        <div className="text-xs text-gray-500">
                          {user.major}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.lastLoginDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${
                        user.isSuspended 
                          ? theme === 'dark' ? 'text-red-400' : 'text-red-600' 
                          : theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {user.isSuspended ? 'ระงับแล้ว' : 'ปกติ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {user.isSuspended ? (
                        <button
                          onClick={() => handleUnsuspendUser(user.id)}
                          className={`px-3 py-1 rounded-md ${
                            theme === 'dark' 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } text-white text-xs`}
                        >
                          ยกเลิกระงับบัญชี
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className={`px-3 py-1 rounded-md ${
                            theme === 'dark' 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-red-600 hover:bg-red-700'
                          } text-white text-xs`}
                        >
                          ระงับบัญชี
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm font-medium"
                  >
                    ไม่พบผู้ใช้งานที่ตรงกับเงื่อนไขการค้นหา
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

export default UserSuspensionPage;