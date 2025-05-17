import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../stores/theme.store';
import { useAuth } from '../hooks/UseAuth.hook';

// คอมโพเนนต์ไอคอนผู้ใช้เมื่อไม่มีรูปภาพ
function UserDefaultIcon() {
  return (
    <svg 
      className="w-full h-full text-gray-700" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  );
}

function Sidebar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, userRole, logout } = useAuth();
  
  // สมมติว่าผู้ใช้ไม่มีรูปภาพ (ในกรณีจริงควรดึงข้อมูลนี้จาก profile ของผู้ใช้)
  const [hasProfileImage, setHasProfileImage] = useState(false);

  // ฟังก์ชันสำหรับการสลับ theme
  const handleThemeChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // ฟังก์ชันสำหรับการออกจากระบบ
  const handleLogout = () => {
    logout();
    // นำทางกลับไปยังหน้า login
    window.location.href = '/login';
  };

  // ตรวจสอบว่าลิงก์ปัจจุบันเป็นลิงก์ที่กำลังแอคทีฟหรือไม่
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // ตรวจสอบบทบาทผู้ใช้
  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'staff';

  return (
    <aside className={`flex flex-col h-screen w-64 fixed left-0 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-md`}>
      {/* ปุ่ม toggle theme ที่มุมขวาบน */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleThemeChange}
          className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-blue-600'}`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            // ไอคอนพระอาทิตย์สำหรับ light mode
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            // ไอคอนพระจันทร์สำหรับ dark mode
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* ส่วนหัวของ Sidebar - โปรไฟล์ผู้ใช้ */}
      <div className={`flex flex-col items-center p-6 pt-12 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
        <div className="relative mb-3 w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500">
          {hasProfileImage ? (
            <img
              src="/api/placeholder/100/100"
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <UserDefaultIcon />
            </div>
          )}
          <button className={`absolute bottom-0 right-0 p-1 rounded-full border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
          </button>
        </div>
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>UserName</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {isAdmin ? 'ผู้ดูแลระบบ' : isStaff ? 'เจ้าหน้าที่' : 'นิสิต'}
        </p>
      </div>

      {/* เมนูในไซด์บาร์ */}
      <nav className="flex-grow px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {/* เมนูหน้าหลัก - แสดงสำหรับทุกคน */}
          <li>
            <Link
              to="/"
              className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                isActive('/') 
                  ? 'bg-blue-600 text-white' 
                  : `${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-100'} hover:text-blue-600`
              }`}
            >
              <svg
                className={`w-5 h-5 ${isActive('/') ? 'text-white' : 'text-blue-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              <span className="ml-3">หน้าหลัก</span>
            </Link>
          </li>
          
          {/* แดชบอร์ดแอดมิน - แสดงเฉพาะแอดมิน */}
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                  isActive('/admin') 
                    ? 'bg-blue-600 text-white' 
                    : `${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-100'} hover:text-blue-600`
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isActive('/admin') ? 'text-white' : 'text-blue-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                <span className="ml-3">แดชบอร์ดผู้ดูแลระบบ</span>
              </Link>
            </li>
          )}

          {/* จัดการสิทธิ์ผู้ใช้ - แสดงเฉพาะแอดมิน */}
          {isAdmin && (
            <li>
              <Link
                to="/admin/user-permissions"
                className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                  isActive('/admin/user-permissions') 
                    ? 'bg-blue-600 text-white' 
                    : `${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-100'} hover:text-blue-600`
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isActive('/admin/user-permissions') ? 'text-white' : 'text-blue-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  ></path>
                </svg>
                <span className="ml-3">จัดการสิทธิ์ผู้ใช้</span>
              </Link>
            </li>
          )}

          {/* ระงับบัญชีผู้ใช้ - แสดงเฉพาะแอดมิน */}
          {isAdmin && (
            <li>
              <Link
                to="/admin/user-suspension"
                className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                  isActive('/admin/user-suspension') 
                    ? 'bg-blue-600 text-white' 
                    : `${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-100'} hover:text-blue-600`
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isActive('/admin/user-suspension') ? 'text-white' : 'text-blue-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  ></path>
                </svg>
                <span className="ml-3">ระงับบัญชีผู้ใช้</span>
              </Link>
            </li>
          )}
          
          {/* แดชบอร์ดเจ้าหน้าที่ - เข้าถึงได้เฉพาะเจ้าหน้าที่ */}
          {isStaff && (
            <li>
              <Link
                to="/staff-dashboard"
                className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                  isActive('/staff-dashboard') 
                    ? 'bg-blue-600 text-white' 
                    : `${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-100'} hover:text-blue-600`
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isActive('/staff-dashboard') ? 'text-white' : 'text-blue-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                <span className="ml-3">แดชบอร์ดเจ้าหน้าที่</span>
              </Link>
            </li>
          )}
          
          {/* กิจกรรมของฉัน - เข้าถึงได้เฉพาะนิสิตและเจ้าหน้าที่ */}
          {!isAdmin && (
            <li>
              <Link
                to="/activities"
                className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                  isActive('/activities') 
                    ? 'bg-blue-600 text-white' 
                    : `${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-100'} hover:text-blue-600`
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isActive('/activities') ? 'text-white' : 'text-blue-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="ml-3">กิจกรรมของฉัน</span>
              </Link>
            </li>
          )}
          
          {/* ประวัติกิจกรรม - เข้าถึงได้เฉพาะนิสิตและเจ้าหน้าที่ */}
          {!isAdmin && (
            <li>
              <Link
                to="/history"
                className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                  isActive('/history') 
                    ? 'bg-blue-600 text-white' 
                    : `${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-100'} hover:text-blue-600`
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isActive('/history') ? 'text-white' : 'text-blue-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="ml-3">ประวัติกิจกรรม</span>
              </Link>
            </li>
          )}
          
          {/* โปรไฟล์ส่วนตัว - แสดงสำหรับทุกคน */}
          {!isAdmin && (
          <li>
            <Link
              to="/profile"
              className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                isActive('/profile') 
                  ? 'bg-blue-600 text-white' 
                  : `${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-100'} hover:text-blue-600`
              }`}
            >
              <svg
                className={`w-5 h-5 ${isActive('/profile') ? 'text-white' : 'text-blue-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              <span className="ml-3">โปรไฟล์ส่วนตัว</span>
            </Link>
          </li>
          )}
        </ul>
            
      </nav>

      {/* ปุ่มออกจากระบบ */}
      <div className={`p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-t`}>
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-4 py-2 rounded-md ${theme === 'dark' ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-red-50'}`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          <span className="ml-3">ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;