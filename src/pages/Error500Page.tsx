import { useNavigate } from 'react-router-dom';
import { useTheme } from '../stores/theme.store';

function Error500Page() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // กำหนดสีตามโหมด
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const secondaryTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${bgColor} ${textColor} px-4`}>
      <div className="max-w-lg w-full text-center">
        {/* ไอคอนผิดพลาด */}
        <div className="flex justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`w-24 h-24 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>

        {/* รหัสข้อผิดพลาด */}
        <h1 className={`text-8xl font-bold mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>500</h1>
        
        {/* ข้อความข้อผิดพลาด */}
        <h2 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาดที่เซิร์ฟเวอร์</h2>
        
        {/* คำอธิบาย */}
        <p className={`text-lg mb-8 ${secondaryTextColor}`}>
          ขออภัย! ระบบกำลังมีปัญหา เรากำลังพยายามแก้ไขให้เร็วที่สุด 
          โปรดลองใหม่อีกครั้งในอีกสักครู่
        </p>
        
        {/* ปุ่มกลับหน้าหลัก */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className={`px-6 py-3 ${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-medium rounded-md transition-colors`}
          >
            กลับหน้าหลัก
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className={`px-6 py-3 ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            } ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-medium rounded-md transition-colors`}
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
        
        {/* รายละเอียดเพิ่มเติม เช่น รหัสข้อผิดพลาด */}
        <div className={`mt-12 text-sm ${secondaryTextColor}`}>
          <p>รหัสข้อผิดพลาด: SERVER_ERROR_500</p>
          <p className="mt-2">
            หากปัญหายังคงอยู่ โปรดติดต่อ <a href="mailto:support@university.ac.th" className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>support@university.ac.th</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Error500Page;