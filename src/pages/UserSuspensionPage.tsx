import { useState, useEffect } from 'react';
import { useTheme } from '../stores/theme.store';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// ประเภทข้อมูลสำหรับผู้ใช้งาน
interface UserItem {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phoneNumber: string;
  faculty: string;
  major: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
  lastLoginDate: string; // Added for sorting
}

// ประเภทสำหรับการเรียงข้อมูล
type SortField = 'name' | 'studentId' | 'role' | 'faculty' | 'major' | 'lastLoginDate' | 'isSuspended' | 'firstName' | 'isBanned';
type SortOrder = 'asc' | 'desc';

function UserSuspensionPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<SortField>('lastLoginDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const getAllUsers = async (page = 1, limit = 10) => {
    try {
      const user = localStorage.getItem('authData');
      const parsedUser = user ? JSON.parse(user) : null;
      const accessToken = parsedUser?.token;
      
      // เพิ่มพารามิเตอร์การเรียงข้อมูลและการค้นหา
      let queryParams = `page=${page}&limit=${limit}`;
      
      // ถ้ามีคำค้นหา ให้ส่งไปกับ API ด้วย
      if (searchTerm) {
        queryParams += `&keyword=${searchTerm}`;
      }
      
      // ถ้ามีการกรองตามบทบาท
      if (filterRole) {
        queryParams += `&role=${filterRole}`;
      }
      
      // ถ้ามีการกรองตามสถานะ
      if (filterStatus === 'ระงับแล้ว') {
        queryParams += `&status=banned`;
      } else if (filterStatus === 'ปกติ') {
        queryParams += `&status=active`;
      }

      // เพิ่มการเรียงข้อมูลตาม sortField และ sortOrder
      queryParams += `&sort=${sortField}&order=${sortOrder}`;

      console.log('Query Params:', queryParams);
      
      const response = await api.get(`/admin/users?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.users.map((user: UserItem) => ({
          ...user,
          name: `${user.firstName} ${user.lastName}`
        }));
        setUsers(data);
        
        // เก็บข้อมูลการแบ่งหน้าจาก response
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        } else if (response.data.pagination?.totalPages) {
          setTotalPages(response.data.pagination.totalPages);
        } else {
          // ถ้าไม่มีข้อมูลจาก API ให้คำนวณจากจำนวนข้อมูลที่ได้รับ
          setTotalPages(Math.ceil(data.length / itemsPerPage));
        }
        
        console.log('Users fetched successfully:', data);
      } else {
        console.error('Error fetching users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  useEffect(() => {
    getAllUsers(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, searchTerm, filterRole, filterStatus, sortField, sortOrder]);

  // ฟังก์ชันเรียงข้อมูล
  const sortUsers = (field: SortField) => {
    // ปรับชื่อฟิลด์ให้ตรงกับ API
    let apiField = field;
    
    // แปลงชื่อฟิลด์ให้ตรงกับ API (ถ้าจำเป็น)
    if (field === 'name') {
      apiField = 'firstName';
    } else if (field === 'isSuspended') {
      apiField = 'isBanned';
    }
    
    if (sortField === field) {
      // ถ้าคลิกที่ฟิลด์เดิม ให้สลับลำดับการเรียง
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // ถ้าคลิกที่ฟิลด์ใหม่ ให้เรียงจากน้อยไปมาก
      setSortField(apiField as SortField);
      setSortOrder('asc');
    }
    
    // เรียกข้อมูลใหม่ทันทีเมื่อมีการเปลี่ยนแปลงการเรียงลำดับ
    getAllUsers(currentPage, itemsPerPage);
  };

  // ฟังก์ชันจัดการการระงับบัญชี
  const handleSuspendUser = async (id: number) => {
    try {
      const user = localStorage.getItem('authData');
      const parsedUser = user ? JSON.parse(user) : null;
      const accessToken = parsedUser?.token;

      // เรียก API สำหรับระงับหรือยกเลิกการระงับบัญชี
      const targetUser = users.find(user => user.id === Number(id));
      const isSuspending = !targetUser?.isBanned; // ค่าตรงข้ามกับสถานะปัจจุบัน

      const comment = window.prompt('กรุณาระบุเหตุผลในการระงับ/ยกเลิกระงับบัญชี (ถ้ามี):', '');

      if (comment === null) {
        // ถ้าผู้ใช้กด Cancel ให้ไม่ทำอะไร
        return;
      }

      console.log(comment, id)
      // ส่งคำขอไปยัง API
      await api.put(
        `/admin/users/${id}/ban`,
        {
          action: isSuspending ? 'ban' : 'unban',
          reason: comment
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // อัพเดทข้อมูลผู้ใช้ในหน้าจอ
      setUsers(users.map(user => 
        user.id === Number(id)
          ? { ...user, isBanned: !user.isBanned, name: `${user.firstName} ${user.lastName}` }
          : { ...user, name: `${user.firstName} ${user.lastName}` }
      ));

      // แสดง Alert หรือข้อความยืนยัน (ทำเพิ่มเติมถ้าต้องการ)
      alert(`${isSuspending ? 'ระงับบัญชี' : 'ยกเลิกการระงับบัญชี'}สำเร็จ`);

    } catch (error) {
      console.error('Error updating user suspension status:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทสถานะบัญชี กรุณาลองใหม่อีกครั้ง');
    }
  };

  // ไม่ต้องมี useEffect ซ้ำสำหรับการเรียงข้อมูล เพราะได้รวมใน useEffect หลักแล้ว
  // และจะเรียก getAllUsers โดยตรงเมื่อมีการคลิกที่หัวตาราง
  
  // ไม่ต้องทำการคำนวณหน้าเอง เพราะใช้ API pagination แล้ว
  const currentItems = users;

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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // เมื่อเปลี่ยนคำค้นหา ให้กลับไปหน้าแรก
                setCurrentPage(1);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  getAllUsers(1, itemsPerPage);
                }
              }}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } border`}
            />
            <div 
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() => getAllUsers(1, itemsPerPage)}
            >
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
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1); // กลับไปหน้าแรกเมื่อเปลี่ยนตัวกรอง
                // เรียกใหม่โดยส่งหน้าแรก
                getAllUsers(1, itemsPerPage);
              }}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border`}
            >
              <option value="">ทุกบทบาท</option>
              <option value="student">นิสิต</option>
              <option value="staff">เจ้าหน้าที่</option>
              <option value="admin">ผู้ดูแลระบบ</option>
            </select>
          </div>
          
          {/* ตัวกรองสถานะ */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1); // กลับไปหน้าแรกเมื่อเปลี่ยนตัวกรอง
                // เรียกใหม่โดยส่งหน้าแรก
                getAllUsers(1, itemsPerPage);
              }}
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
                        {user.firstName} {user.lastName}
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
                        user.role === 'staff' 
                          ? 'bg-blue-600 text-white' 
                          : user.role === 'admin'
                            ? 'bg-purple-600 text-white'
                            : 'bg-green-600 text-white'
                      }`}>
                        {user.role === 'staff' ? 'เจ้าหน้าที่' : 
                         user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'นิสิต'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="truncate max-w-[150px]" title={`${user.faculty || '-'} ${user.major || '-'}`}>
                        {user.faculty || '-'}
                        <div className="text-xs text-gray-500">
                          {user.major || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(user.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${
                        user.isBanned 
                          ? theme === 'dark' ? 'text-red-400' : 'text-red-600' 
                          : theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {user.isBanned ? 'ระงับแล้ว' : 'ปกติ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {/* ไม่อนุญาตให้ระงับบัญชี admin */}
                      {user.role === 'admin' ? (
                        <span className="text-xs text-gray-500">ไม่สามารถระงับบัญชีผู้ดูแลระบบได้</span>
                      ) : user.isBanned ? (
                        <button
                          onClick={() => handleSuspendUser(user.id)}
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
        {users.length > 0 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              {/* ปุ่มย้อนกลับ */}
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
              
              {/* แสดงปุ่มหมายเลขหน้า แบบปรับปรุงแล้ว */}
              {(() => {
                // คำนวณตัวเลขหน้าที่จะแสดง
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, startPage + 4);
                
                // ปรับใหม่ถ้าไม่ครบ 5 หน้า
                if (endPage - startPage < 4) {
                  startPage = Math.max(1, endPage - 4);
                }
                
                const pages = [];
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === i
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600 text-white'
                          : theme === 'dark'
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                return pages;
              })()}
              
              {/* ปุ่มไปหน้าถัดไป */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages} // ใช้ totalPages จาก API
                className={`px-3 py-1 rounded-md ${
                  currentPage >= totalPages
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